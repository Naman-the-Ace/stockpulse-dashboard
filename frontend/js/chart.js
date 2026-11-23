/**
 * StockPulse — Chart Manager v2
 * TradingView Lightweight Charts with candlestick, MA, volume, and prediction.
 */

const ChartManager = {
    chart: null,
    candleSeries: null,
    maSeries: null,
    ma20Series: null,
    bbUpperSeries: null,
    bbLowerSeries: null,
    volumeSeries: null,
    predictionSeries: null,
    volumeChart: null,
    compareChart: null,
    _currentData: [],
    _indicators: {
        ma7: true,
        ma20: false,
        bb: false,
    },

    chartOptions: {
        layout: {
            background: { type: 'solid', color: '#131838' },
            textColor: '#8f93b0',
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
        },
        grid: {
            vertLines: { color: 'rgba(255,255,255,0.03)' },
            horzLines: { color: 'rgba(255,255,255,0.03)' },
        },
        crosshair: {
            mode: 0,
            vertLine: { color: '#7c3aed', width: 1, style: 2, labelBackgroundColor: '#7c3aed' },
            horzLine: { color: '#7c3aed', width: 1, style: 2, labelBackgroundColor: '#7c3aed' },
        },
        timeScale: { borderColor: 'rgba(255,255,255,0.06)', timeVisible: false },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' },
        handleScroll: { vertTouchDrag: false },
    },

    createMainChart(containerId, volumeContainerId) {
        const container = document.getElementById(containerId);
        const volumeContainer = document.getElementById(volumeContainerId);
        if (!container) return;

        container.innerHTML = '';
        this.chart = null; this.candleSeries = null; this.maSeries = null;
        this.ma20Series = null; this.bbUpperSeries = null; this.bbLowerSeries = null;
        this.predictionSeries = null; this.volumeChart = null; this.volumeSeries = null;

        // Main candlestick chart
        this.chart = LightweightCharts.createChart(container, {
            ...this.chartOptions,
            width: container.clientWidth,
            height: 350,
        });

        this.candleSeries = this.chart.addCandlestickSeries({
            upColor: '#10b981', downColor: '#ef4444',
            borderDownColor: '#ef4444', borderUpColor: '#10b981',
            wickDownColor: '#ef4444', wickUpColor: '#10b981',
        });

        // Setup crosshair listener for HUD
        this._setupCrosshairHUD();

        // MA 7 line
        this.maSeries = this.chart.addLineSeries({
            color: '#7c3aed', lineWidth: 2, lineStyle: 0,
            priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        });

        // MA 20 line
        this.ma20Series = this.chart.addLineSeries({
            color: '#38bdf8', lineWidth: 2, lineStyle: 0,
            priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        });

        // Bollinger Bands
        this.bbUpperSeries = this.chart.addLineSeries({
            color: 'rgba(245, 158, 11, 0.7)', lineWidth: 1, lineStyle: 2,
            priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        });
        this.bbLowerSeries = this.chart.addLineSeries({
            color: 'rgba(245, 158, 11, 0.7)', lineWidth: 1, lineStyle: 2,
            priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        });

        // Volume chart
        if (volumeContainer) {
            volumeContainer.innerHTML = '';
            this.volumeChart = LightweightCharts.createChart(volumeContainer, {
                ...this.chartOptions,
                width: volumeContainer.clientWidth,
                height: 70,
                rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)', scaleMargins: { top: 0.1, bottom: 0 } },
                timeScale: { visible: false },
            });

            this.volumeSeries = this.volumeChart.addHistogramSeries({
                priceFormat: { type: 'volume' },
                priceScaleId: '',
            });

            // Sync time scales
            this.chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
                if (this.volumeChart && range) {
                    this.volumeChart.timeScale().setVisibleLogicalRange(range);
                }
            });
        }

        // Resize observer
        const ro = new ResizeObserver(entries => {
            const w = entries[0].contentRect.width;
            if (this.chart) this.chart.applyOptions({ width: w });
            if (this.volumeChart) this.volumeChart.applyOptions({ width: w });
        });
        ro.observe(container);
    },

    updateMainChart(data) {
        if (!this.candleSeries || !data.length) return;
        this._currentData = data;

        const candleData = data.map(d => ({ time: d.date, open: d.open, high: d.high, low: d.low, close: d.close }));
        this.candleSeries.setData(candleData);

        // Update default HUD with latest candle
        this._updateHUDWithCandle(data[data.length - 1]);

        // Render indicators based on state
        this._renderIndicators();

        // Volume histogram with green/red coloring
        if (this.volumeSeries) {
            const volData = data.map(d => ({
                time: d.date,
                value: d.volume,
                color: d.close >= d.open ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
            }));
            this.volumeSeries.setData(volData);
        }

        this.chart.timeScale().fitContent();
        if (this.volumeChart) this.volumeChart.timeScale().fitContent();
    },

    toggleIndicator(name) {
        if (this._indicators[name] !== undefined) {
            this._indicators[name] = !this._indicators[name];
            this._renderIndicators();
        }
        return this._indicators[name];
    },

    _renderIndicators() {
        if (!this._currentData || !this._currentData.length) return;
        const data = this._currentData;

        // MA 7
        if (this.maSeries) {
            if (this._indicators.ma7) {
                const maData = data.filter(d => d.ma_7 != null).map(d => ({ time: d.date, value: d.ma_7 }));
                this.maSeries.setData(maData);
            } else {
                this.maSeries.setData([]);
            }
        }

        // MA 20
        if (this.ma20Series) {
            if (this._indicators.ma20) {
                const ma20Data = this._calculateMA(data, 20);
                this.ma20Series.setData(ma20Data);
            } else {
                this.ma20Series.setData([]);
            }
        }

        // Bollinger Bands (20 period, 2 std dev)
        if (this.bbUpperSeries && this.bbLowerSeries) {
            if (this._indicators.bb) {
                const { upper, lower } = this._calculateBollingerBands(data, 20, 2);
                this.bbUpperSeries.setData(upper);
                this.bbLowerSeries.setData(lower);
            } else {
                this.bbUpperSeries.setData([]);
                this.bbLowerSeries.setData([]);
            }
        }
    },

    _calculateMA(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) continue;
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            result.push({ time: data[i].date, value: Number((sum / period).toFixed(2)) });
        }
        return result;
    },

    _calculateBollingerBands(data, period = 20, stdDevMultiplier = 2) {
        const upper = [];
        const lower = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) continue;
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            const mean = sum / period;
            let variance = 0;
            for (let j = 0; j < period; j++) {
                variance += Math.pow(data[i - j].close - mean, 2);
            }
            const std = Math.sqrt(variance / period);
            upper.push({ time: data[i].date, value: Number((mean + stdDevMultiplier * std).toFixed(2)) });
            lower.push({ time: data[i].date, value: Number((mean - stdDevMultiplier * std).toFixed(2)) });
        }
        return { upper, lower };
    },

    _setupCrosshairHUD() {
        if (!this.chart) return;
        this.chart.subscribeCrosshairMove(param => {
            if (!param || !param.time || !param.seriesData || !param.seriesData.size) {
                if (this._currentData && this._currentData.length) {
                    this._updateHUDWithCandle(this._currentData[this._currentData.length - 1]);
                }
                return;
            }

            const candle = param.seriesData.get(this.candleSeries);
            if (candle) {
                const dateStr = typeof param.time === 'string'
                    ? param.time
                    : `${param.time.year}-${String(param.time.month).padStart(2, '0')}-${String(param.time.day).padStart(2, '0')}`;
                
                // Find matching volume from data
                const matched = this._currentData.find(d => d.date === dateStr);
                this._updateHUDWithCandle({
                    date: dateStr,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                    volume: matched ? matched.volume : null,
                });
            }
        });
    },

    _updateHUDWithCandle(c) {
        if (!c) return;
        const dateEl = document.getElementById('hud-date');
        const openEl = document.getElementById('hud-open');
        const highEl = document.getElementById('hud-high');
        const lowEl = document.getElementById('hud-low');
        const closeEl = document.getElementById('hud-close');
        const chgEl = document.getElementById('hud-change');
        const volEl = document.getElementById('hud-vol');

        if (dateEl) dateEl.textContent = c.date || '—';
        if (openEl) openEl.textContent = c.open ? Utils.formatCurrency(c.open) : '—';
        if (highEl) highEl.textContent = c.high ? Utils.formatCurrency(c.high) : '—';
        if (lowEl) lowEl.textContent = c.low ? Utils.formatCurrency(c.low) : '—';
        if (closeEl) closeEl.textContent = c.close ? Utils.formatCurrency(c.close) : '—';

        if (chgEl && c.open && c.close) {
            const chg = ((c.close - c.open) / c.open) * 100;
            const prefix = chg >= 0 ? '+' : '';
            chgEl.textContent = `${prefix}${chg.toFixed(2)}%`;
            chgEl.className = 'hud-val ' + (chg >= 0 ? 'gain' : 'loss');
        }

        if (volEl) {
            volEl.textContent = c.volume ? Number(c.volume).toLocaleString('en-IN') : '—';
        }
    },

    addPredictionLine(predictions) {
        if (!this.chart || !predictions.length) return;
        if (this.predictionSeries) this.chart.removeSeries(this.predictionSeries);

        this.predictionSeries = this.chart.addLineSeries({
            color: '#f59e0b', lineWidth: 2, lineStyle: 2,
            priceLineVisible: false, lastValueVisible: true, crosshairMarkerVisible: true,
        });
        this.predictionSeries.setData(predictions.map(p => ({ time: p.date, value: p.predicted_close })));
        this.chart.timeScale().fitContent();
    },

    createCompareChart(containerId, data1, data2, label1, label2) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        this.compareChart = LightweightCharts.createChart(container, {
            ...this.chartOptions, width: container.clientWidth, height: 280,
        });

        const norm1 = this._normalizeToBase100(data1);
        const norm2 = this._normalizeToBase100(data2);

        const s1 = this.compareChart.addLineSeries({ color: '#7c3aed', lineWidth: 2, priceLineVisible: false });
        s1.setData(norm1);
        const s2 = this.compareChart.addLineSeries({ color: '#00d4aa', lineWidth: 2, priceLineVisible: false });
        s2.setData(norm2);

        this.compareChart.timeScale().fitContent();

        const ro = new ResizeObserver(entries => {
            if (this.compareChart) this.compareChart.applyOptions({ width: entries[0].contentRect.width });
        });
        ro.observe(container);
    },

    _normalizeToBase100(data) {
        if (!data.length) return [];
        const base = data[0].close;
        if (!base) return [];
        return data.map(d => ({ time: d.date, value: (d.close / base) * 100 }));
    },
};
