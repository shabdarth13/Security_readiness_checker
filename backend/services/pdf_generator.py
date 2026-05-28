from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def create_pdf_report(filename, findings, score_data):
    doc = SimpleDocTemplate(filename, pagesize=A4)
    styles = getSampleStyleSheet()
    content = []

    title = Paragraph("Security Audit Readiness Report", styles['Title'])
    content.append(title)
    content.append(Spacer(1, 12))

    score_text = Paragraph(
        f"Score: {score_data['score']} | Percentage: {score_data['percentage']}% | Risk Level: {score_data['risk_level']}",
        styles['Normal']
    )
    content.append(score_text)
    content.append(Spacer(1, 12))

    for item in findings:
        text = Paragraph(
            f"Weakness: {item['weakness']}<br/>Severity: {item['severity']}<br/>Recommendation: {item['recommendation']}",
            styles['Normal']
        )
        content.append(text)
        content.append(Spacer(1, 10))

    doc.build(content)