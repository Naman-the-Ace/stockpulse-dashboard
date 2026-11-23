"""
Unit and integration tests for StockPulse API and services.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.services import stock_service, analytics_service, prediction_service

client = TestClient(app)


def test_list_companies():
    response = client.get("/api/v1/companies")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    symbols = [c["symbol"] for c in data]
    assert "RELIANCE.NS" in symbols
    assert "TCS.NS" in symbols


def test_get_stock_data():
    response = client.get("/api/v1/data/RELIANCE.NS?days=30")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    item = data[0]
    assert "date" in item
    assert "open" in item
    assert "close" in item
    assert "volume" in item


def test_get_market_overview():
    response = client.get("/api/v1/market-overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_stocks"] == 10
    assert "market_breadth" in data
    assert "sectors" in data
    assert len(data["sectors"]) > 0


def test_get_gainers_losers():
    response = client.get("/api/v1/gainers-losers?n=5")
    assert response.status_code == 200
    data = response.json()
    assert "gainers" in data
    assert "losers" in data


def test_get_summary():
    response = client.get("/api/v1/summary/RELIANCE.NS")
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "RELIANCE.NS"
    assert data["latest_close"] is not None
    assert data["high_52w"] is not None
    assert data["low_52w"] is not None


def test_compare_stocks():
    response = client.get("/api/v1/compare?symbol1=RELIANCE.NS&symbol2=TCS.NS&days=90")
    assert response.status_code == 200
    data = response.json()
    assert data["symbol1"] == "RELIANCE.NS"
    assert data["symbol2"] == "TCS.NS"
    assert "correlation" in data
    assert len(data["data1"]) > 0
    assert len(data["data2"]) > 0


def test_predict_stock():
    response = client.get("/api/v1/predict/RELIANCE.NS?days=7")
    assert response.status_code == 200
    data = response.json()
    assert data["symbol"] == "RELIANCE.NS"
    assert len(data["predictions"]) == 7


def test_correlation_matrix():
    response = client.get("/api/v1/correlation?days=90")
    assert response.status_code == 200
    data = response.json()
    assert len(data["symbols"]) == 10
    assert len(data["matrix"]) == 10


def test_screener():
    response = client.get("/api/v1/screener")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10


def test_export_csv():
    response = client.get("/api/v1/export/RELIANCE.NS?days=30")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "Date,Open,High,Low,Close" in response.text
