# StockPulse — Intelligence Dashboard

**🚀 Live Demo: [https://stockpulse-dashboard-0906.onrender.com/](https://stockpulse-dashboard-0906.onrender.com/)**

A **premium, full-stack financial data intelligence platform** that ingests real NSE (National Stock Exchange of India) equities data, executes quantitative financial modeling, and delivers actionable market insights through an ultra-responsive, dark-themed financial workstation.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Deployment](https://img.shields.io/badge/Render-Deployed-success?logo=render)
![Tests](https://img.shields.io/badge/Tests-10%2F10%20Passing-brightgreen)

---

## ⚡ Highlights & Key Capabilities

| Capability | Description |
|------------|-------------|
| **AI Quant Verdict Engine** | Automated rule-based quantitative synthesis providing directional signal badges (`STRONG BUY`, `CAUTION`, `BEARISH`), institutional sentiment, and narrative drivers |
| **Interactive Crosshair HUD** | Real-time heads-up display inspecting `Date`, `Open`, `High`, `Low`, `Close`, `Change (%)`, and `Volume` under the cursor |
| **Multi-Indicator Overlay Bar** | On-the-fly toggles for **MA(7)**, **MA(20)**, and dynamic **Bollinger Bands** (20-day, 2σ volatility envelope) |
| **Market Pulse Dashboard** | Macro market breadth gauge, advances vs. declines ratio, sector-level performance breakdown, and quick-glance tickers |
| **Professional Charts** | TradingView Lightweight Charts with candlestick rendering, dual synchronized volume histogram, and prediction lines |
| **Machine Learning Forecasting** | 7-day multi-lag Linear Regression forecasting model with historical feature engineering and $R^2$ validation score |
| **Stock Screener** | Real-time multi-parameter filtering across daily return %, annualized volatility %, composite sentiment, and sector |
| **Correlation Heatmap** | High-DPI HTML5 Canvas Pearson correlation matrix illustrating cross-asset covariance and diversification opportunities |
| **Stock Comparison** | Base-100 normalized performance charts for comparative return analysis and pairwise correlation calculations |
| **11 REST API Endpoints** | Enterprise-grade OpenAPI 3.0 specification with interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) |
| **Production Ready** | Fully dockerized with `Dockerfile` + `docker-compose.yml` and native Render Blueprint (`render.yaml`) |

---

## 🏗️ Architecture

```text
       +---------------------------------------------+
       |   Yahoo Finance API (yfinance Live Data)    |
       +---------------------------------------------+
                              │
                              ▼
       +---------------------------------------------+
       |   Pandas / NumPy Data Cleaning & Metrics    |
       |  (Intraday Fills, Rolling Volatility, RSI)  |
       +---------------------------------------------+
                              │
                              ▼
       +---------------------------------------------+
       |   SQLite + SQLAlchemy 2.0 ORM Persistence   |
       |     (Normalized Companies & Price Series)   |
       +---------------------------------------------+
                              │
                              ▼
       +---------------------------------------------+
       |        FastAPI High-Performance Backend     |
       |  (11 REST Endpoints, Caching, ML Regressor) |
       +---------------------------------------------+
                              │
               JSON REST API  │  Static Assets
                              ▼
       +---------------------------------------------+
       |        Single Page Application (SPA)        |
       |  - TradingView Lightweight Charts           |
       |  - Crosshair HUD & Technical Indicator Bar  |
       |  - HTML5 Canvas Pearson Correlation Matrix  |
       |  - Responsive Glassmorphism Dashboard       |
       +---------------------------------------------+
```

---

## 🛠️ Tech Stack

- **Backend Framework:** FastAPI, Uvicorn (ASGI)
- **Database & ORM:** SQLite 3, SQLAlchemy 2.0
- **Quantitative & Data Processing:** Pandas, NumPy, scikit-learn
- **Market Data Feed:** Yahoo Finance (`yfinance`)
- **Charting & Visualizations:** TradingView Lightweight Charts v4.1, HTML5 Canvas API
- **Testing:** Pytest, HTTPX / Starlette TestClient
- **DevOps & Containers:** Docker, Docker Compose, Render Cloud Platform

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Git

### 1. Clone & Set Up Virtual Environment
```bash
git clone https://github.com/Naman-the-Ace/stockpulse-dashboard.git
cd stockpulse-dashboard
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Seed Database
Ingests historical OHLCV data for all 10 tracked equities, computes indicators, and seeds SQLite:
```bash
python scripts/seed_data.py
```

### 3. Run the Application
```bash
uvicorn app.main:app --reload
```

### 4. Access the Dashboard
- **Web Dashboard:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Running Automated Tests

Run the comprehensive pytest test suite covering all 10 API endpoints, statistical transformations, and prediction logic:

```bash
pytest -v
```

---

## 🐳 Docker Deployment

Run locally in an isolated container environment with a single command:

```bash
docker-compose up --build
```
Then visit [http://localhost:8000](http://localhost:8000).

---

## ☁️ Cloud Deployment (Render)

This repository includes a native `render.yaml` Blueprint:
1. Fork or push this repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), choose **New + -> Blueprint**.
3. Select your repository. Render automatically configures the environment, executes dependencies, seeds the database, and launches Uvicorn.

---

## 📡 API Reference (11 Endpoints)

| Endpoint | Method | Params | Description |
|----------|--------|--------|-------------|
| `/api/v1/companies` | `GET` | — | List all tracked companies, symbols, and sectors |
| `/api/v1/data/{symbol}` | `GET` | `days` (default 30) | Historical OHLCV series + indicators for a stock |
| `/api/v1/summary/{symbol}` | `GET` | — | 52-week summary stats, RSI, latest sentiment & volatility |
| `/api/v1/compare` | `GET` | `symbol1`, `symbol2`, `days` | Pairwise comparison, correlation, and normalized series |
| `/api/v1/predict/{symbol}` | `GET` | `days` (default 7) | 7-day linear regression forecast with model $R^2$ score |
| `/api/v1/gainers-losers` | `GET` | `n` (default 5) | Top advancing and declining equities of the session |
| `/api/v1/market-overview` | `GET` | — | Market breadth, advance/decline count, sector breakdown |
| `/api/v1/correlation` | `GET` | `days` (default 90) | Complete Pearson correlation matrix of daily returns |
| `/api/v1/screener` | `GET` | `min_return`, `max_volatility`, `min_sentiment`, `sector` | Filter equities by quantitative performance thresholds |
| `/api/v1/export/{symbol}` | `GET` | `days` (default 365) | Export cleaned OHLCV and indicator records as CSV |
| `/docs` | `GET` | — | OpenAPI interactive Swagger UI documentation |

---

## 🖥️ Workstation Interface

### 1. Market Overview & Sector Pulse
- **Market Breadth Gauge:** Real-time advance vs. decline proportion across tracked equities.
- **Sector Heat Breakdown:** Average sector return performance bars.
- **Stock Snapshot Cards:** Direct click-through cards displaying latest prices and volatility ratings.

<img src="assets/v2_overview.png" alt="Market Overview" width="800">

### 2. Stock Detail & Interactive Charting Workstation
- **TradingView Candlestick Chart:** Fast, hardware-accelerated financial visualization.
- **Interactive Crosshair HUD:** Real-time OHLCV inspection directly above the chart.
- **Indicator Toggles:** One-click toggles for MA(7), MA(20), and Bollinger Bands.
- **AI Quant Intelligence Verdict:** Synthesized narrative breakdown with directional trading bias.
- **7 Comprehensive Stat Cards:** 52-Week High/Low, Average Close, Annualized Volatility, Sentiment Index, Daily Return %, and 14-day Wilder RSI.
- **ML Price Forecasting:** Generates projected price points over a 7-day horizon with model quality metrics.
- **Stock Comparison Tool:** Overlay two equities normalized to Base-100 to evaluate performance divergence.

<img src="assets/v2_stockdetail.png" alt="Stock Detail" width="800">

### 3. Quantitative Stock Screener
- Filter the equities universe by minimum return, volatility thresholds, sentiment scores, or specific industry sectors.

<img src="assets/v2_screener.png" alt="Stock Screener" width="800">

### 4. Correlation Heatmap
- High-resolution Pearson correlation matrix rendered dynamically on HTML5 Canvas to identify co-movement and hedge opportunities.

---

## 📊 Equities Tracked

| Ticker | Company | Sector |
|--------|---------|--------|
| `RELIANCE.NS` | Reliance Industries Ltd | Energy / Conglomerate |
| `TCS.NS` | Tata Consultancy Services Ltd | IT Services |
| `INFY.NS` | Infosys Ltd | IT Services |
| `HDFCBANK.NS` | HDFC Bank Ltd | Banking |
| `ICICIBANK.NS` | ICICI Bank Ltd | Banking |
| `HINDUNILVR.NS` | Hindustan Unilever Ltd | FMCG |
| `BHARTIARTL.NS` | Bharti Airtel Ltd | Telecom |
| `SBIN.NS` | State Bank of India | Banking |
| `BAJFINANCE.NS` | Bajaj Finance Ltd | Financial Services |
| `LT.NS` | Larsen & Toubro Ltd | Engineering & Infrastructure |

---

## 🧮 Quantitative Methods

### 1. Annualized Volatility
$$\sigma_{\text{ann}} = \sigma_{\text{30d}} \times \sqrt{252}$$
Categorized into Low ($<15\%$), Medium ($15\% - 30\%$), and High ($>30\%$) risk regimes.

### 2. Relative Strength Index (RSI - 14)
Computed using Wilder's smoothed moving average:
$$\text{RSI} = 100 - \left( \frac{100}{1 + \text{RS}} \right), \quad \text{RS} = \frac{\text{Avg Gain}}{\text{Avg Loss}}$$

### 3. Composite Sentiment Index ($0 - 100$)
$$S = \left( 0.40 \cdot R_{\text{norm}} + 0.30 \cdot V_{\text{norm}} + 0.30 \cdot (1 - \sigma_{\text{norm}}) \right) \times 100$$
Combines short-term return momentum, volume deviation relative to 30-day baseline, and inverse normalized volatility.

### 4. Bollinger Bands ($20, 2\sigma$)
$$\text{Middle Band} = \text{SMA}_{20}(P), \quad \text{Upper} = \text{SMA}_{20}(P) + 2\sigma, \quad \text{Lower} = \text{SMA}_{20}(P) - 2\sigma$$

---

## 📂 Project Structure

```text
stockpulse-dashboard/
├── app/
│   ├── api/
│   │   └── routes/          # Modular API routers (companies, data, summary, compare)
│   ├── data/
│   │   ├── cleaner.py       # Data validation, null sanitization, metric calculations
│   │   └── collector.py     # Yahoo Finance historical ingestion engine
│   ├── models/
│   │   └── stock.py         # SQLAlchemy ORM models (Company, StockPrice)
│   ├── schemas/
│   │   └── stock.py         # Pydantic v2 validation and serialization schemas
│   ├── services/
│   │   ├── analytics_service.py   # Pairwise comparisons, covariance
│   │   ├── prediction_service.py  # scikit-learn Linear Regression forecaster
│   │   └── stock_service.py       # Core queries, screener, stats aggregation
│   ├── config.py            # App settings, symbols universe, database paths
│   ├── database.py          # SQLAlchemy engine and session dependency
│   └── main.py              # FastAPI app instantiation, middleware, static mounting
├── frontend/
│   ├── css/
│   │   └── styles.css       # Custom modern dark-glass UI styles & animations
│   ├── js/
│   │   ├── api.js           # API client with cache handling
│   │   ├── app.js           # View state management & DOM orchestration
│   │   ├── chart.js         # TradingView & HUD crosshair implementation
│   │   └── utils.js         # Formatting, currency, and animation utilities
│   └── index.html           # Single Page Application layout
├── scripts/
│   └── seed_data.py         # Ingestion script to download, clean, and seed DB
├── tests/
│   └── test_api.py          # Pytest suite covering all API endpoints
├── Dockerfile               # Production container image definition
├── docker-compose.yml       # Local container orchestration
├── render.yaml              # Cloud deployment Blueprint specification
├── requirements.txt         # Pinned Python package dependencies
└── README.md
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
