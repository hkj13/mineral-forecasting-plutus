# Mineral Forecasting Platform

> **Plutus Hackathon 2025 | TEXMiN Foundation | IIT(ISM) Dhanbad**

A comprehensive data analytics solution for analyzing India's Export-Import (EXIM) data for critical minerals (Copper, Lithium, Graphite) to support strategic decision-making and enhance mineral security.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)

## 🎯 Features

### Dashboard
- **KPI Strip**: Import dependency, trade deficit, 12-month forecast, HHI concentration
- **Interactive Charts**: Time series trends, seasonal heatmaps, trade balance visualization
- **Dependency Matrix**: Real-time import dependency gauges for all minerals
- **Trade Partner Network**: Top suppliers with concentration analysis
- **Insight Cards**: AI-generated natural language analytics summaries

### Forecasting Engine
- **Multi-Model Suite**: ARIMA, LSTM, and Hybrid ARIMA-LSTM models
- **Confidence Intervals**: 90% prediction intervals via bootstrapping
- **Model Comparison**: Side-by-side metrics (MAE, MAPE, RMSE, R²)
- **Interactive Controls**: Adjustable horizon (6-36 months), model selection

### Scenario Builder
- **What-If Simulations**: Import bans, price spikes, production ramps
- **Policy Impact Analysis**: Quantified effects on trade balance
- **Shareable Scenarios**: URL-based scenario sharing for collaboration
- **Policy Recommendations**: AI-generated mitigation strategies

## 🚀 Quick Start

### Demo Credentials
```
Email: judge@plutus.iitism.ac.in
Password: Plutus2025!
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/hkj13/mineral-forecasting-plutus.git
cd mineral-forecasting-plutus

# Generate mock data
cd data
python mock_generator.py
cd ..

# Start the API server
cd api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
cd ..

# Start the web app (in new terminal)
cd web
npm install
npm run dev
```

Visit `http://localhost:3000` and use the demo credentials above.

## 📁 Repository Structure

```
mineral-forecasting-plutus/
├── web/                    # Next.js frontend (Vercel-ready)
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and API client
│   └── package.json
├── api/                    # FastAPI backend
│   ├── app/
│   │   └── main.py        # API endpoints
│   └── requirements.txt
├── models/                 # ML model notebooks and artifacts
│   ├── notebooks/         # Training notebooks
│   └── saved/             # Saved model files
├── data/
│   ├── raw/               # Raw data files
│   ├── processed/         # Processed datasets
│   ├── mappings/          # HS code mappings
│   └── mock_generator.py  # Synthetic data generator
├── docs/                   # Documentation
├── notebooks/              # Analysis notebooks
├── reports/                # Generated reports
└── tests/                  # Test suites
```

## 🔧 Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| ML Models | statsmodels (ARIMA), TensorFlow (LSTM) |
| Charts | Recharts |
| UI Components | Radix UI, Lucide Icons |
| Deployment | Vercel (frontend), Docker (API) |

## 📊 Data Sources

As specified in the competition brief (pages 3-6):

| Source | Description |
|--------|-------------|
| DGCI&S | Foreign Trade Data Dissemination Portal (ftddp.dgciskol.gov.in) |
| TRADESTAT | Ministry of Commerce portal (tradestat.commerce.gov.in) |
| IBM | Indian Bureau of Mines - Monthly Statistics |
| GSI | Geological Survey of India mineral databases |

### HS Code Mapping

The platform uses ITC-HS 8-digit codes for mineral classification:

| Mineral | Key HS Codes | Chapters |
|---------|--------------|----------|
| Copper | 26030010, 74031100, 74031200 | 26, 74 |
| Lithium | 25309099, 28369100, 28252000 | 25, 28 |
| Graphite | 25041010, 25041020, 38011000 | 25, 38 |

See `data/mappings/hs_codes_mapping.csv` for the complete mapping.

## 🎯 Evaluation Rubric Alignment

| Criteria | Weight | Features |
|----------|--------|----------|
| Data Integration Quality | 20% | Multi-source ingestion, HS code mapping, data normalization |
| Analytical Depth | 25% | ANOVA, seasonal decomposition, dependency analysis, network analysis |
| ML Model Performance | 25% | ARIMA, LSTM, Hybrid models with hyperparameter tuning |
| Visualization & Presentation | 15% | Interactive dashboard, accessible design, export options |
| Strategic Value | 15% | Policy simulator, scenario builder, actionable recommendations |

## 🔐 Security

- No credentials stored in repository
- Demo accounts seeded via environment variables
- API authentication with JWT tokens
- CORS configured for production domains

## 📋 Deployment to Vercel

1. Fork this repository
2. Connect to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
4. Deploy

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Team

**Plutus Hackathon 2025 Submission**

- Built for TEXMiN Foundation | IIT(ISM) Dhanbad
- Mineral Forecasting Challenge

## 📚 References

1. DGCI&S Foreign Trade Statistics
2. Ministry of Mines - Critical Minerals List (2023)
3. National Critical Mineral Mission (NCMM) Documentation
4. Indian Bureau of Mines - Annual Reports
5. ITC-HS Classification Guidelines

---

*This project was developed as part of the Plutus Hackathon hosted by IIT(ISM) Dhanbad.*
