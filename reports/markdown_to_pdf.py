#!/usr/bin/env python3
"""
Convert markdown to PDF with header image
"""
import os
import sys
from pathlib import Path

try:
    from markdown2 import markdown
    from weasyprint import HTML, CSS
except ImportError:
    print("Installing required packages...")
    os.system("pip install markdown2 weasyprint -q")
    from markdown2 import markdown
    from weasyprint import HTML, CSS

def markdown_to_pdf(md_file, output_pdf):
    """Convert markdown file to PDF with styling."""
    
    # Read markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown(md_content, extras=['tables', 'fenced-code-blocks'])
    
    # Add CSS styling for professional look
    css_styling = """
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #1a5490;
            border-bottom: 3px solid #1a5490;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        h2 {
            color: #2a6bb8;
            margin-top: 25px;
        }
        h3 {
            color: #4a8fd9;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        th {
            background-color: #1a5490;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #1a5490;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        a {
            color: #1a5490;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
    """
    
    # Combine CSS and HTML
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Critical Mineral Forecasting Platform</title>
        {css_styling}
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Convert to PDF
    HTML(string=full_html).write_pdf(output_pdf)
    print(f"PDF generated successfully: {output_pdf}")

if __name__ == "__main__":
    md_file = "/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/FINAL_SUBMISSION_REPORT_FORMAL.md"
    output_pdf = "/Users/hk/CascadeProjects/mineral-forecasting-plutus/reports/FINAL_SUBMISSION_REPORT.pdf"
    
    markdown_to_pdf(md_file, output_pdf)