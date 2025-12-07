# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-07

### Added
- Initial MVP release for Plutus Hackathon 2025
- Complete web dashboard with KPIs, charts, and insights
- Forecasting engine with ARIMA, LSTM, and Hybrid models
- Scenario builder for what-if policy simulations
- Authentication system with demo credentials
- FastAPI backend with 15+ endpoints
- HS code mapping for 30 critical minerals
- Mock data generator with 3,400+ trade records
- Docker configuration for deployment
- GitHub Actions CI/CD pipeline
- Comprehensive documentation

### Data Sources
- ITC-HS code mapping (80+ codes across chapters 25, 26, 28, 71, 72-83)
- Synthetic trade data matching DGCI&S statistical properties
- Global commodity prices (LME benchmarks)
- Domestic production estimates (IBM/GSI based)

### Models
- ARIMA with seasonal components (SARIMA)
- LSTM with dropout regularization
- Hybrid ARIMA-LSTM ensemble (best performer: R² = 0.94)

### Minerals Covered
- Copper (26030010, 74031100, etc.)
- Lithium (25309099, 28369100, 28252000)
- Graphite (25041010, 25041020, 38011000)

---

## Future Roadmap

### [1.1.0] - Planned
- Live DGCI&S data integration
- Trade partner network visualization
- Geospatial import flow maps
- PDF report generation

### [1.2.0] - Planned
- All 30 critical minerals support
- State-level GST/HSN mapping
- Advanced anomaly detection
- Multi-user collaboration features
