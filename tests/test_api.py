"""
API Tests for Mineral Forecasting Platform
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestMineralsEndpoint:
    """Test minerals metadata endpoint"""
    
    def test_get_minerals(self):
        response = client.get("/minerals")
        assert response.status_code == 200
        data = response.json()
        assert "minerals" in data
        assert len(data["minerals"]) == 3
        
        mineral_names = [m["name"] for m in data["minerals"]]
        assert "Copper" in mineral_names
        assert "Lithium" in mineral_names
        assert "Graphite" in mineral_names
    
    def test_mineral_has_required_fields(self):
        response = client.get("/minerals")
        data = response.json()
        
        for mineral in data["minerals"]:
            assert "name" in mineral
            assert "symbol" in mineral
            assert "hs_chapters" in mineral
            assert "primary_use" in mineral
            assert "dependency_ratio" in mineral


class TestAuthEndpoint:
    """Test authentication endpoints"""
    
    def test_login_valid_credentials(self):
        response = client.post("/auth/login", json={
            "email": "judge@plutus.iitism.ac.in",
            "password": "Plutus2025!"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        assert data["user"]["email"] == "judge@plutus.iitism.ac.in"
    
    def test_login_invalid_credentials(self):
        response = client.post("/auth/login", json={
            "email": "invalid@email.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401


class TestForecastEndpoint:
    """Test forecasting endpoint"""
    
    def test_generate_forecast(self):
        response = client.post("/forecast", json={
            "mineral": "Copper",
            "horizon_months": 12,
            "model_type": "hybrid",
            "confidence_level": 0.90
        })
        assert response.status_code == 200
        data = response.json()
        
        assert data["mineral"] == "Copper"
        assert data["model_type"] == "hybrid"
        assert len(data["forecast_dates"]) == 12
        assert len(data["forecast_values"]) == 12
        assert len(data["lower_bound"]) == 12
        assert len(data["upper_bound"]) == 12
        assert "metrics" in data
    
    def test_forecast_invalid_mineral(self):
        response = client.post("/forecast", json={
            "mineral": "InvalidMineral",
            "horizon_months": 12,
            "model_type": "hybrid",
            "confidence_level": 0.90
        })
        assert response.status_code == 404


class TestDependencyMetrics:
    """Test dependency metrics endpoint"""
    
    def test_get_all_dependency_metrics(self):
        response = client.get("/metrics/dependency")
        assert response.status_code == 200
        data = response.json()
        
        assert "Copper" in data
        assert "Lithium" in data
        assert "Graphite" in data
    
    def test_get_mineral_specific_metrics(self):
        response = client.get("/metrics/dependency?mineral=Lithium")
        assert response.status_code == 200
        data = response.json()
        
        assert "Lithium" in data
        lithium = data["Lithium"]
        assert "current_dependency_ratio" in lithium
        assert "top_3_suppliers" in lithium
        assert lithium["current_dependency_ratio"] >= 0.9  # Lithium is highly dependent


class TestScenarioSimulation:
    """Test scenario simulation endpoint"""
    
    def test_simulate_import_ban(self):
        response = client.post("/scenarios/simulate", json={
            "mineral": "Lithium",
            "scenario_type": "import_ban",
            "magnitude": 0.42,
            "affected_country": "China",
            "duration_months": 12
        })
        assert response.status_code == 200
        data = response.json()
        
        assert data["scenario_type"] == "import_ban"
        assert data["mineral"] == "Lithium"
        assert "baseline_forecast" in data
        assert "scenario_forecast" in data
        assert "impact_analysis" in data
        assert "policy_implications" in data["impact_analysis"]


class TestAnovaAnalysis:
    """Test ANOVA analysis endpoint"""
    
    def test_get_anova_by_mineral(self):
        response = client.get("/analytics/anova?group_by=mineral")
        assert response.status_code == 200
        data = response.json()
        
        assert "f_statistic" in data
        assert "p_value" in data
        assert "significant" in data


class TestPolicySimulator:
    """Test policy simulator endpoint"""
    
    def test_dependency_reduction_simulation(self):
        response = client.get(
            "/policy/simulator?mineral=Graphite&target_dependency_ratio=0.5&annual_production_increase_pct=10"
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["mineral"] == "Graphite"
        assert data["target_dependency_ratio"] == 0.5
        assert "years_to_target" in data
        assert "trajectory" in data
        assert "policy_recommendations" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
