#!/usr/bin/env python3
"""
Simple markdown to PDF converter using pypdf and reportlab
"""
import os
import sys

# Install required package
os.system("pip install reportlab --quiet")

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def create_pdf():
    """Create PDF from markdown content."""
    
    pdf_file = "/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/FINAL_SUBMISSION_REPORT.pdf"
    doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    # Container for PDF elements
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a5490'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#2a6bb8'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # Add header image
    try:
        img = Image("/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/header_banner.png", 
                   width=6*inch, height=2*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.3*inch))
    except:
        print("Warning: Header image not found")
    
    # Title
    elements.append(Paragraph("CRITICAL MINERAL FORECASTING PLATFORM", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Subtitle
    elements.append(Paragraph("Comprehensive Analysis Report for Import-Export Trade Forecasting", heading_style))
    elements.append(Paragraph("Copper, Lithium, and Graphite", heading_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Metadata
    meta_data = [
        ["Plutus Hackathon 2025"],
        ["Presented by: Team PLEO"],
        ["Submission Date: December 30, 2025"]
    ]
    meta_table = Table(meta_data, colWidths=[6*inch])
    meta_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Dashboard Access
    elements.append(Paragraph("LIVE DASHBOARD ACCESS", heading_style))
    dashboard_data = [
        ["Live URL", "https://mineral-forecasting-plutus.vercel.app/login"],
        ["Email", "judge@plutus.iitism.ac.in"],
        ["Password", "Plutus2025!"]
    ]
    dashboard_table = Table(dashboard_data, colWidths=[1.5*inch, 4.5*inch])
    dashboard_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(dashboard_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Key Results
    elements.append(Paragraph("KEY RESULTS", heading_style))
    results_data = [
        ["Mineral", "Import Dependency", "Trade Deficit (FY25)"],
        ["Copper", "89%", "USD 6.74 Billion"],
        ["Lithium", "78%", "USD 275 Million"],
        ["Graphite", "73%", "USD 108 Million"]
    ]
    results_table = Table(results_data, colWidths=[1.5*inch, 2*inch, 2.5*inch])
    results_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(results_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ML Model Performance
    elements.append(Paragraph("ML MODEL PERFORMANCE", heading_style))
    model_data = [
        ["Model", "MAE", "MAPE", "RMSE", "R-Squared"],
        ["ARIMA", "12.5", "4.2%", "18.3", "0.89"],
        ["LSTM", "10.8", "3.8%", "15.6", "0.91"],
        ["Hybrid (RECOMMENDED)", "9.2", "3.2%", "13.4", "0.94"]
    ]
    model_table = Table(model_data, colWidths=[1.2*inch, 0.9*inch, 0.9*inch, 0.9*inch, 1.1*inch])
    model_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#e8f4f8')),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(model_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Resources
    elements.append(Paragraph("RESOURCES FOR JUDGES", heading_style))
    resources_data = [
        ["Judges Repository", "https://github.com/hkj13/mineral-forecasting-judges"],
        ["Jupyter Notebook", "notebooks/mineral_forecasting_models.ipynb"],
        ["Processed Data", "data/processed/*.csv"],
        ["Full Report", "reports/FINAL_SUBMISSION_REPORT_FORMAL.md"]
    ]
    resources_table = Table(resources_data, colWidths=[2*inch, 4*inch])
    resources_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#1a5490')),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f0f0')])
    ]))
    elements.append(resources_table)
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_text = "Plutus Hackathon 2025 | Team PLEO | TEXMiN Foundation, IIT (ISM) Dhanbad"
    elements.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_CENTER,
        textColor=colors.grey
    )))
    
    # Build PDF
    doc.build(elements)
    print(f"PDF generated successfully: {pdf_file}")
    return pdf_file

if __name__ == "__main__":
    create_pdf()
