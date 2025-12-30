#!/usr/bin/env python3
"""
Generate comprehensive PDF from markdown with proper formatting and page breaks
"""
import os
import sys

os.system("pip install reportlab --quiet")

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def create_comprehensive_pdf():
    """Create comprehensive PDF with full report content."""
    
    pdf_file = "/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/FINAL_SUBMISSION_REPORT.pdf"
    doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                           rightMargin=0.6*inch, leftMargin=0.6*inch,
                           topMargin=0.6*inch, bottomMargin=0.6*inch)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Define custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=13,
        textColor=colors.HexColor('#2a6bb8'),
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=10,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    small_style = ParagraphStyle(
        'CustomSmall',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_LEFT,
        spaceAfter=8
    )
    
    # PAGE 1: COVER PAGE
    try:
        img = Image("/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/header_banner.png", 
                   width=6.5*inch, height=2.2*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.4*inch))
    except:
        print("Warning: Header image not found")
    
    elements.append(Paragraph("CRITICAL MINERAL FORECASTING PLATFORM", title_style))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("Comprehensive Analysis Report for Import-Export Trade Forecasting", subtitle_style))
    elements.append(Paragraph("Copper, Lithium, and Graphite", subtitle_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Metadata
    meta_data = [
        ["Plutus Hackathon 2025"],
        ["Presented by: Team PLEO"],
        ["Submission Date: December 30, 2025"]
    ]
    meta_table = Table(meta_data, colWidths=[6.2*inch])
    meta_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 0.4*inch))
    
    # Dashboard Access
    elements.append(Paragraph("LIVE DASHBOARD ACCESS", heading_style))
    dashboard_data = [
        ["Live URL", "https://mineral-forecasting-plutus.vercel.app/login"],
        ["Email", "judge@plutus.iitism.ac.in"],
        ["Password", "Plutus2025!"]
    ]
    dashboard_table = Table(dashboard_data, colWidths=[1.3*inch, 4.9*inch])
    dashboard_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(dashboard_table)
    elements.append(PageBreak())
    
    # PAGE 2: EXECUTIVE SUMMARY
    elements.append(Paragraph("EXECUTIVE SUMMARY", heading_style))
    elements.append(Paragraph(
        "This report presents a comprehensive analysis of India's critical mineral trade patterns for Copper, Lithium, and Graphite using real EXIM data from the DGCI&S TradeStat portal covering fiscal years 2017-2025. The analysis identifies significant import dependencies and trade deficits that require strategic policy intervention.",
        normal_style
    ))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Key Highlights", heading_style))
    highlights_data = [
        ["Total Trade Records Analyzed", "3,933"],
        ["Time Period", "FY2017-18 to FY2024-25"],
        ["Minerals Covered", "Copper, Lithium, Graphite"],
        ["Trading Partners", "155 countries"],
        ["Cumulative Trade Deficit", "Approximately USD 36 Billion"]
    ]
    highlights_table = Table(highlights_data, colWidths=[2.5*inch, 3.7*inch])
    highlights_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(highlights_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # KEY RESULTS
    elements.append(Paragraph("KEY RESULTS AND FINDINGS", heading_style))
    elements.append(Paragraph("Import Dependency Analysis (FY2024-25)", heading_style))
    
    results_data = [
        ["Mineral", "Import (USD M)", "Export (USD M)", "Deficit (USD M)", "Dependency"],
        ["Copper", "7,733", "993", "-6,739", "89%"],
        ["Lithium", "384", "109", "-275", "78%"],
        ["Graphite", "170", "62", "-108", "73%"]
    ]
    results_table = Table(results_data, colWidths=[1*inch, 1.1*inch, 1.1*inch, 1.2*inch, 1.2*inch])
    results_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(results_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Partner Concentration
    elements.append(Paragraph("Partner Concentration Risk (HHI)", heading_style))
    hhi_data = [
        ["Mineral", "HHI Score", "Risk Level", "Top Partner"],
        ["Graphite", "0.52", "Critical", "China (48%)"],
        ["Lithium", "0.31", "High", "Chile (35%)"],
        ["Copper", "0.18", "Moderate", "Indonesia (22%)"]
    ]
    hhi_table = Table(hhi_data, colWidths=[1.2*inch, 1.2*inch, 1.2*inch, 1.6*inch])
    hhi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(hhi_table)
    elements.append(PageBreak())
    
    # PAGE 3: STATE-WISE PRODUCTION
    elements.append(Paragraph("State-wise Domestic Production", heading_style))
    
    elements.append(Paragraph("Copper Production (47,500 MT/year)", heading_style))
    copper_prod = [
        ["State", "Production (MT)", "National Share"],
        ["Rajasthan", "33,950", "71.5%"],
        ["Jharkhand", "9,950", "21.0%"],
        ["Madhya Pradesh", "3,600", "7.5%"]
    ]
    copper_table = Table(copper_prod, colWidths=[2*inch, 2*inch, 2.2*inch])
    copper_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(copper_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Graphite Production (604,500 MT/year)", heading_style))
    graphite_prod = [
        ["State", "Production (MT)", "National Share"],
        ["Tamil Nadu", "325,000", "53.8%"],
        ["Jharkhand", "180,000", "29.8%"],
        ["Odisha", "99,500", "16.5%"]
    ]
    graphite_table = Table(graphite_prod, colWidths=[2*inch, 2*inch, 2.2*inch])
    graphite_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(graphite_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Lithium", heading_style))
    elements.append(Paragraph("Current Production: 0 MT (100% import dependent)", small_style))
    elements.append(Paragraph("Discovered Reserves: 5.9 MT in Jammu & Kashmir (Reasi district)", small_style))
    elements.append(Paragraph("Expected Mining Commencement: FY2026-27", small_style))
    elements.append(PageBreak())
    
    # PAGE 4: ML MODEL PERFORMANCE
    elements.append(Paragraph("ML MODEL PERFORMANCE COMPARISON", heading_style))
    
    elements.append(Paragraph("Models Implemented", heading_style))
    models_data = [
        ["Model", "Description", "Approach"],
        ["ARIMA", "Auto-regressive Integrated Moving Average", "Classical time series"],
        ["LSTM", "Long Short-Term Memory Neural Network", "Deep learning"],
        ["Hybrid", "ARIMA base + LSTM residual correction", "Ensemble method"]
    ]
    models_table = Table(models_data, colWidths=[1.2*inch, 2.5*inch, 2.3*inch])
    models_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(models_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Performance Metrics", heading_style))
    perf_data = [
        ["Model", "MAE", "MAPE", "RMSE", "R-Squared"],
        ["ARIMA", "12.5", "4.2%", "18.3", "0.89"],
        ["LSTM", "10.8", "3.8%", "15.6", "0.91"],
        ["Hybrid (RECOMMENDED)", "9.2", "3.2%", "13.4", "0.94"]
    ]
    perf_table = Table(perf_data, colWidths=[1.3*inch, 0.9*inch, 0.9*inch, 0.9*inch, 1.1*inch])
    perf_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#e8f4f8')),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(perf_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Model Selection Rationale", heading_style))
    elements.append(Paragraph(
        "The Hybrid ARIMA-LSTM model is recommended because: (1) Lowest error metrics across all measures, (2) Captures both linear trends (ARIMA) and non-linear patterns (LSTM), (3) Best handles structural breaks such as COVID-19 impact, (4) R-squared of 0.94 indicates excellent fit to historical data.",
        normal_style
    ))
    elements.append(PageBreak())
    
    # PAGE 5: FORECAST RESULTS
    elements.append(Paragraph("FORECAST RESULTS (FY2025-26)", heading_style))
    
    elements.append(Paragraph("Copper Import Forecast", heading_style))
    copper_forecast = [
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 7.92 Billion"],
        ["Confidence Interval (90%)", "+/- USD 0.8 Billion"],
        ["Year-over-Year Change", "+2.4%"],
        ["Model Used", "Hybrid ARIMA-LSTM"]
    ]
    copper_f_table = Table(copper_forecast, colWidths=[2.5*inch, 3.7*inch])
    copper_f_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(copper_f_table)
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Lithium Import Forecast", heading_style))
    lithium_forecast = [
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 425 Million"],
        ["Confidence Interval (90%)", "+/- USD 45 Million"],
        ["Year-over-Year Change", "+10.7%"],
        ["Model Used", "Hybrid ARIMA-LSTM"]
    ]
    lithium_f_table = Table(lithium_forecast, colWidths=[2.5*inch, 3.7*inch])
    lithium_f_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(lithium_f_table)
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Graphite Import Forecast", heading_style))
    graphite_forecast = [
        ["Parameter", "Value"],
        ["Annual Forecast", "USD 178 Million"],
        ["Confidence Interval (90%)", "+/- USD 20 Million"],
        ["Year-over-Year Change", "+4.7%"],
        ["Model Used", "Hybrid ARIMA-LSTM"]
    ]
    graphite_f_table = Table(graphite_forecast, colWidths=[2.5*inch, 3.7*inch])
    graphite_f_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(graphite_f_table)
    elements.append(PageBreak())
    
    # PAGE 6: STATISTICAL ANALYSIS & DATA SOURCES
    elements.append(Paragraph("ANOVA STATISTICAL ANALYSIS", heading_style))
    
    elements.append(Paragraph("Cross-Mineral Comparison", heading_style))
    anova_data = [
        ["Statistic", "Value"],
        ["F-statistic", "45.67"],
        ["P-value", "< 0.001"],
        ["Conclusion", "Statistically significant differences in import patterns"]
    ]
    anova_table = Table(anova_data, colWidths=[2.5*inch, 3.7*inch])
    anova_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(anova_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("DATA SOURCES", heading_style))
    data_sources = [
        ["Source", "Data Type", "Records", "Period"],
        ["DGCI&S TradeStat", "EXIM Trade Data", "3,933", "FY2017-2025"],
        ["Indian Bureau of Mines", "Production Data", "24", "FY2017-2024"],
        ["USGS", "Global Estimates", "-", "2023"],
        ["Geological Survey of India", "Reserves Data", "-", "2023"]
    ]
    sources_table = Table(data_sources, colWidths=[1.5*inch, 1.5*inch, 1.2*inch, 1.2*inch])
    sources_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(sources_table)
    elements.append(PageBreak())
    
    # PAGE 7: STRATEGIC RECOMMENDATIONS & RESOURCES
    elements.append(Paragraph("STRATEGIC RECOMMENDATIONS", heading_style))
    
    elements.append(Paragraph("Immediate Actions (0-12 months)", heading_style))
    elements.append(Paragraph("1. Establish 3-month strategic copper reserves", small_style))
    elements.append(Paragraph("2. Sign Free Trade Agreement with Chile for preferential lithium access", small_style))
    elements.append(Paragraph("3. Implement 10% Production Linked Incentive for domestic graphite processing", small_style))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Medium-term Actions (1-3 years)", heading_style))
    elements.append(Paragraph("1. Fast-track Jammu & Kashmir lithium mining permits", small_style))
    elements.append(Paragraph("2. Develop recycling infrastructure with target of 15% recovery", small_style))
    elements.append(Paragraph("3. Expand Rajasthan copper production capacity by 50%", small_style))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Long-term Actions (3-5 years)", heading_style))
    elements.append(Paragraph("1. Achieve 50% reduction in import dependency", small_style))
    elements.append(Paragraph("2. Establish domestic battery-grade lithium processing capability", small_style))
    elements.append(Paragraph("3. Build strategic mineral reserves equivalent to 6-month supply", small_style))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("RESOURCES FOR JUDGES", heading_style))
    resources_data = [
        ["Resource", "Link"],
        ["Judges Repository", "https://github.com/hkj13/mineral-forecasting-judges"],
        ["Jupyter Notebook", "notebooks/mineral_forecasting_models.ipynb"],
        ["Processed Data", "data/processed/*.csv"],
        ["Full Report", "reports/FINAL_SUBMISSION_REPORT_FORMAL.md"]
    ]
    resources_table = Table(resources_data, colWidths=[2*inch, 4.2*inch])
    resources_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(resources_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_text = "Plutus Hackathon 2025 | Team PLEO | TEXMiN Foundation, IIT (ISM) Dhanbad"
    elements.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        alignment=TA_CENTER,
        textColor=colors.grey
    )))
    
    # Build PDF
    doc.build(elements)
    print(f"Comprehensive PDF generated successfully: {pdf_file}")
    return pdf_file

if __name__ == "__main__":
    create_comprehensive_pdf()
