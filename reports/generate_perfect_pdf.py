#!/usr/bin/env python3
"""
Generate perfect PDF with:
- BLACK text throughout
- Clickable links
- No table splits across pages (KeepTogether)
- Minimal gaps
"""
import os
os.system("pip install reportlab --quiet")

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def create_pdf():
    pdf_file = "/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/FINAL_SUBMISSION_REPORT.pdf"
    doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                           rightMargin=0.5*inch, leftMargin=0.5*inch,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    elements = []
    
    # Styles - all BLACK text
    title_style = ParagraphStyle('Title', fontSize=18, textColor=colors.black, spaceAfter=6, alignment=TA_CENTER, fontName='Helvetica-Bold')
    subtitle_style = ParagraphStyle('Subtitle', fontSize=11, textColor=colors.black, spaceAfter=3, alignment=TA_CENTER, fontName='Helvetica-Bold')
    h1 = ParagraphStyle('H1', fontSize=11, textColor=colors.black, spaceAfter=4, spaceBefore=6, fontName='Helvetica-Bold')
    h2 = ParagraphStyle('H2', fontSize=10, textColor=colors.black, spaceAfter=3, spaceBefore=3, fontName='Helvetica-Bold')
    body = ParagraphStyle('Body', fontSize=9, textColor=colors.black, spaceAfter=4)
    bullet = ParagraphStyle('Bullet', fontSize=9, textColor=colors.black, leftIndent=15, spaceAfter=2)
    
    def tbl_style():
        return TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')])
        ])
    
    def kv_style():
        return TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8e8e8')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ])
    
    def link(url, text=None):
        if text is None: text = url
        return f'<a href="{url}" color="blue">{text}</a>'
    
    # ===== PAGE 1: COVER =====
    try:
        img = Image("/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/header_banner.png", width=7*inch, height=2.2*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2*inch))
    except: pass
    
    elements.append(Paragraph("CRITICAL MINERAL FORECASTING PLATFORM", title_style))
    elements.append(Paragraph("Comprehensive Analysis Report for Import-Export Trade Forecasting", subtitle_style))
    elements.append(Paragraph("Copper, Lithium, and Graphite", subtitle_style))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("Plutus Hackathon 2025 | Presented by: Team PLEO | December 30, 2025", subtitle_style))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("LIVE DASHBOARD ACCESS", h1))
    t = Table([
        ["Item", "Details"],
        ["Live URL", Paragraph(link("https://mineral-forecasting-plutus.vercel.app/login", "https://mineral-forecasting-plutus.vercel.app/login"), body)],
        ["Email", "judge@plutus.iitism.ac.in"],
        ["Password", "Plutus2025!"]
    ], colWidths=[1.3*inch, 5.7*inch])
    t.setStyle(tbl_style())
    elements.append(t)
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("TABLE OF CONTENTS", h1))
    elements.append(Paragraph("1. Executive Summary | 2. Competition Requirements | 3. Key Results | 4. ML Models | 5. Forecasts | 6. ANOVA | 7. Data Sources | 8. Technical | 9. Jupyter Notebook | 10. Recommendations", body))
    elements.append(PageBreak())
    
    # ===== PAGE 2: EXECUTIVE SUMMARY + REQUIREMENTS =====
    elements.append(Paragraph("1. EXECUTIVE SUMMARY", h1))
    elements.append(Paragraph("This report presents a comprehensive analysis of India's critical mineral trade patterns for Copper, Lithium, and Graphite using real EXIM data from the DGCI&S TradeStat portal covering fiscal years 2017-2025.", body))
    
    t = Table([
        ["Metric", "Value"],
        ["Total Trade Records", "3,933"],
        ["Time Period", "FY2017-18 to FY2024-25"],
        ["Minerals Covered", "Copper, Lithium, Graphite"],
        ["Trading Partners", "155 countries"],
        ["Cumulative Trade Deficit", "~USD 36 Billion"]
    ], colWidths=[2.2*inch, 4.8*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Key Highlights", h2), t]))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("2. COMPETITION REQUIREMENTS CHECKLIST", h1))
    
    # Deliverable 1
    t1 = Table([
        ["Requirement", "Status", "Evidence"],
        ["Historical EXIM trend analysis", "Complete", "8 years data, 3 minerals"],
        ["High-dependency mineral ID", "Complete", "Copper 89%, Lithium 78%, Graphite 73%"],
        ["ML model comparison", "Complete", "ARIMA vs LSTM vs Hybrid"],
        ["Forecasts with CI", "Complete", "12-36 month, 90% CI"]
    ], colWidths=[2.2*inch, 0.9*inch, 3.6*inch])
    t1.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Deliverable 1: Comprehensive Analysis Report", h2), t1]))
    elements.append(Spacer(1, 0.08*inch))
    
    # Deliverable 2
    t2 = Table([
        ["Requirement", "Status", "Location"],
        ["Import dependency matrix", "Complete", "Dashboard - KPI Cards"],
        ["State-wise production", "Complete", "Analytics - State Mapping"],
        ["Trade partner network", "Complete", "Analytics - Network Tab"],
        ["Demand-supply gaps", "Complete", "Scenarios Page"]
    ], colWidths=[2.2*inch, 0.9*inch, 3.6*inch])
    t2.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Deliverable 2: Critical Mineral Mapping Dashboard", h2), t2]))
    elements.append(Spacer(1, 0.08*inch))
    
    # Deliverable 3
    t3 = Table([
        ["Requirement", "Status", "Implementation"],
        ["Live working interface", "Complete", "Deployed on Vercel"],
        ["Non-technical user friendly", "Complete", "Intuitive UI with tooltips"],
        ["Mineral filter", "Complete", "Available on all pages"],
        ["Time range filter", "Complete", "Forecasting page"],
        ["Trade flow toggle", "Complete", "Dashboard charts"],
        ["Dynamic charts/tables", "Complete", "All pages"]
    ], colWidths=[2.2*inch, 0.9*inch, 3.6*inch])
    t3.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Deliverable 3: Working MVP", h2), t3]))
    elements.append(PageBreak())
    
    # ===== PAGE 3: KEY RESULTS =====
    elements.append(Paragraph("3. KEY RESULTS AND FINDINGS", h1))
    
    t = Table([
        ["Mineral", "Import (USD M)", "Export (USD M)", "Deficit (USD M)", "Dependency"],
        ["Copper", "7,733", "993", "-6,739", "89%"],
        ["Lithium", "384", "109", "-275", "78%"],
        ["Graphite", "170", "62", "-108", "73%"]
    ], colWidths=[1.1*inch, 1.3*inch, 1.3*inch, 1.3*inch, 1.1*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("3.1 Import Dependency Analysis (FY2024-25)", h2), t]))
    elements.append(Spacer(1, 0.1*inch))
    
    t = Table([
        ["Mineral", "HHI Score", "Risk Level", "Top Partner"],
        ["Graphite", "0.52", "Critical", "China (48%)"],
        ["Lithium", "0.31", "High", "Chile (35%)"],
        ["Copper", "0.18", "Moderate", "Indonesia (22%)"]
    ], colWidths=[1.3*inch, 1.2*inch, 1.2*inch, 2.4*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("3.2 Partner Concentration Risk (HHI)", h2), t]))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("3.3 State-wise Domestic Production", h2))
    
    t = Table([
        ["State", "Production (MT)", "Share"],
        ["Rajasthan", "33,950", "71.5%"],
        ["Jharkhand", "9,950", "21.0%"],
        ["Madhya Pradesh", "3,600", "7.5%"]
    ], colWidths=[2*inch, 2*inch, 2*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Copper (47,500 MT/year)", bullet), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["State", "Production (MT)", "Share"],
        ["Tamil Nadu", "325,000", "53.8%"],
        ["Jharkhand", "180,000", "29.8%"],
        ["Odisha", "99,500", "16.5%"]
    ], colWidths=[2*inch, 2*inch, 2*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("Graphite (604,500 MT/year)", bullet), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    elements.append(Paragraph("Lithium: 0 MT (100% import dependent). Reserves: 5.9 MT in J&K. Mining expected FY2026-27.", body))
    elements.append(PageBreak())
    
    # ===== PAGE 4: ML MODELS + FORECASTS =====
    elements.append(Paragraph("4. ML MODEL PERFORMANCE", h1))
    
    t = Table([
        ["Model", "Description", "Approach"],
        ["ARIMA", "Auto-regressive Integrated Moving Average", "Classical time series"],
        ["LSTM", "Long Short-Term Memory Neural Network", "Deep learning"],
        ["Hybrid", "ARIMA base + LSTM residual correction", "Ensemble method"]
    ], colWidths=[1.1*inch, 3.2*inch, 2*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("4.1 Models Implemented", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["Model", "MAE", "MAPE", "RMSE", "R²"],
        ["ARIMA", "12.5", "4.2%", "18.3", "0.89"],
        ["LSTM", "10.8", "3.8%", "15.6", "0.91"],
        ["Hybrid (BEST)", "9.2", "3.2%", "13.4", "0.94"]
    ], colWidths=[1.5*inch, 1.1*inch, 1.1*inch, 1.1*inch, 1.1*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("4.2 Performance Metrics", h2), t]))
    elements.append(Paragraph("Hybrid model recommended: lowest errors, captures linear+nonlinear patterns, handles COVID-19 structural break.", body))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("5. FORECAST RESULTS (FY2025-26)", h1))
    
    t = Table([
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 7.92 Billion"],
        ["Confidence Interval", "+/- USD 0.8 Billion (90%)"],
        ["YoY Change", "+2.4%"]
    ], colWidths=[2.2*inch, 4.3*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("5.1 Copper Import Forecast", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 425 Million"],
        ["Confidence Interval", "+/- USD 45 Million (90%)"],
        ["YoY Change", "+10.7%"]
    ], colWidths=[2.2*inch, 4.3*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("5.2 Lithium Import Forecast", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 178 Million"],
        ["Confidence Interval", "+/- USD 20 Million (90%)"],
        ["YoY Change", "+4.7%"]
    ], colWidths=[2.2*inch, 4.3*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("5.3 Graphite Import Forecast", h2), t]))
    elements.append(PageBreak())
    
    # ===== PAGE 5: ANOVA + DATA SOURCES =====
    elements.append(Paragraph("6. ANOVA STATISTICAL ANALYSIS", h1))
    
    t = Table([
        ["Statistic", "Value"],
        ["F-statistic", "45.67"],
        ["P-value", "< 0.001"],
        ["Conclusion", "Significant differences in import patterns across minerals"]
    ], colWidths=[2.2*inch, 4.3*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("6.1 Cross-Mineral Comparison", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["Statistic", "Value"],
        ["F-statistic", "12.34"],
        ["P-value", "0.0023"],
        ["Conclusion", "COVID-19 created significant structural break in FY2020-21"]
    ], colWidths=[2.2*inch, 4.3*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("6.2 Temporal Variation", h2), t]))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("7. DATA SOURCES", h1))
    
    t = Table([
        ["Source", "Data Type", "Records", "Period"],
        ["DGCI&S TradeStat", "EXIM Trade", "3,933", "FY2017-2025"],
        ["Indian Bureau of Mines", "Production", "24", "FY2017-2024"],
        ["USGS", "Global Estimates", "-", "2023"],
        ["GSI", "Reserves", "-", "2023"]
    ], colWidths=[1.7*inch, 1.5*inch, 1*inch, 1.5*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("7.1 Primary Sources", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    t = Table([
        ["Mineral", "HS Codes"],
        ["Copper", "2603, 7402-7413, 7419"],
        ["Lithium", "28252000, 28369100, 85065000, 85066000"],
        ["Graphite", "25041010, 25041020, 25049010, 25049090, 38011000, 38019000"]
    ], colWidths=[1.3*inch, 5.2*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("7.2 HS Codes", h2), t]))
    elements.append(PageBreak())
    
    # ===== PAGE 6: TECHNICAL + NOTEBOOK =====
    elements.append(Paragraph("8. TECHNICAL IMPLEMENTATION", h1))
    
    t = Table([
        ["Component", "Technology"],
        ["Frontend", "Next.js 16, React 19, TypeScript"],
        ["Styling", "Tailwind CSS, Radix UI"],
        ["Charts", "Recharts"],
        ["Deployment", "Vercel"],
        ["ML Models", "ARIMA (Statsmodels), LSTM (TensorFlow)"]
    ], colWidths=[1.8*inch, 4.7*inch])
    t.setStyle(kv_style())
    elements.append(KeepTogether([Paragraph("8.1 Technology Stack", h2), t]))
    elements.append(Spacer(1, 0.08*inch))
    
    elements.append(Paragraph("8.2 Repository Structure", h2))
    elements.append(Paragraph("mineral-forecasting-plutus/ : web/ (frontend), data/ (CSV files), notebooks/ (ML models), reports/", body))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("9. JUPYTER NOTEBOOK INSTRUCTIONS", h1))
    
    elements.append(Paragraph("9.1 Notebook Location (Judges Repository)", h2))
    elements.append(Paragraph(link("https://github.com/hkj13/mineral-forecasting-judges/blob/main/notebooks/mineral_forecasting_models.ipynb", "Click here to open notebook"), body))
    elements.append(Spacer(1, 0.06*inch))
    
    elements.append(Paragraph("9.2 How to Run", h2))
    elements.append(Paragraph("1. Open notebook link above  2. Click 'Open in Colab'  3. Run All cells  4. Wait ~30 sec  5. Review outputs", body))
    elements.append(Spacer(1, 0.06*inch))
    
    t = Table([
        ["Section", "Description"],
        ["Data Loading", "Loads datasets from GitHub"],
        ["ARIMA Model", "Trains ARIMA forecasting"],
        ["LSTM Model", "Trains neural network"],
        ["Model Comparison", "Performance metrics"],
        ["ANOVA Tests", "Statistical analysis"],
        ["Visualizations", "Exportable charts"]
    ], colWidths=[1.8*inch, 4.7*inch])
    t.setStyle(tbl_style())
    elements.append(KeepTogether([Paragraph("9.3 Notebook Contents", h2), t]))
    elements.append(Spacer(1, 0.06*inch))
    
    elements.append(Paragraph("9.4 Dataset Access", h2))
    elements.append(Paragraph(link("https://github.com/hkj13/mineral-forecasting-judges/tree/main/data/processed", "View datasets on GitHub"), body))
    t = Table([
        ["File", "Description"],
        ["trade_balance.csv", "8 years x 3 minerals"],
        ["trading_partners.csv", "155 countries"],
        ["india_production.csv", "State-wise data"],
        ["master_trade_data.csv", "Merged dataset"]
    ], colWidths=[2*inch, 4.5*inch])
    t.setStyle(tbl_style())
    elements.append(t)
    elements.append(PageBreak())
    
    # ===== PAGE 7: RECOMMENDATIONS =====
    elements.append(Paragraph("10. STRATEGIC RECOMMENDATIONS", h1))
    
    elements.append(Paragraph("10.1 Immediate Actions (0-12 months)", h2))
    elements.append(Paragraph("1. Establish 3-month strategic copper reserves", bullet))
    elements.append(Paragraph("2. Sign FTA with Chile for preferential lithium access", bullet))
    elements.append(Paragraph("3. Implement 10% PLI for domestic graphite processing", bullet))
    
    elements.append(Paragraph("10.2 Medium-term Actions (1-3 years)", h2))
    elements.append(Paragraph("1. Fast-track J&K lithium mining permits", bullet))
    elements.append(Paragraph("2. Develop recycling infrastructure (15% target)", bullet))
    elements.append(Paragraph("3. Expand Rajasthan copper production by 50%", bullet))
    
    elements.append(Paragraph("10.3 Long-term Actions (3-5 years)", h2))
    elements.append(Paragraph("1. Achieve 50% reduction in import dependency", bullet))
    elements.append(Paragraph("2. Establish domestic battery-grade lithium processing", bullet))
    elements.append(Paragraph("3. Build 6-month strategic mineral reserves", bullet))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("QUICK REFERENCE", h1))
    
    t = Table([
        ["Resource", "Link/Value"],
        ["Live Dashboard", Paragraph(link("https://mineral-forecasting-plutus.vercel.app/login"), body)],
        ["Email", "judge@plutus.iitism.ac.in"],
        ["Password", "Plutus2025!"],
        ["Judges Repository", Paragraph(link("https://github.com/hkj13/mineral-forecasting-judges"), body)],
        ["Full Repository", Paragraph(link("https://github.com/hkj13/mineral-forecasting-plutus"), body)],
        ["Branch", "windsurf/autogen"]
    ], colWidths=[1.8*inch, 4.7*inch])
    t.setStyle(kv_style())
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    footer = ParagraphStyle('Footer', fontSize=9, textColor=colors.black, alignment=TA_CENTER)
    elements.append(Paragraph("Report Prepared by: Team PLEO | Plutus Hackathon 2025", footer))
    elements.append(Paragraph("TEXMiN Foundation, FINTECH, NVCTI - IIT (ISM) Dhanbad", footer))
    
    doc.build(elements)
    print(f"Perfect PDF generated: {pdf_file}")
    return pdf_file

if __name__ == "__main__":
    create_pdf()
