from flask import Blueprint, send_file, jsonify
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from config.db import get_db_connection

pdf_bp = Blueprint("pdf", __name__)


@pdf_bp.route("/export/<int:user_id>", methods=["GET"])
def export_pdf(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT
                f.weakness,
                f.severity,
                f.recommendation,
                qcm.iso_standard,
                qcm.nist_standard,
                qcm.pci_standard,
                qcm.soc2_standard,
                qcm.gdpr_standard,
                qcm.hipaa_standard,
                qcm.cobit_standard
            FROM findings f
            LEFT JOIN question_compliance_mapping qcm
            ON f.question_id = qcm.question_id
            WHERE f.user_id = %s
            ORDER BY f.id DESC
            """,
            (user_id,)
        )

        findings = cur.fetchall()

        if not findings:
            return jsonify({
                "error": "No findings found for this user"
            }), 404

        file_path = f"audit_report_user_{user_id}.pdf"

        c = canvas.Canvas(file_path, pagesize=A4)
        width, height = A4

        y = height - 50

        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, y, "Security Audit Report")

        y -= 30

        c.setFont("Helvetica", 11)
        c.drawString(50, y, f"User ID: {user_id}")

        y -= 35

        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Key Findings")

        y -= 25

        for index, item in enumerate(findings, start=1):
            if y < 140:
                c.showPage()
                y = height - 50

            c.setFont("Helvetica-Bold", 11)
            c.drawString(50, y, f"Finding #{index}")

            y -= 18

            c.setFont("Helvetica", 10)
            c.drawString(60, y, f"Weakness: {item['weakness'][:90]}")
            y -= 16

            c.drawString(60, y, f"Severity: {item['severity']}")
            y -= 16

            c.drawString(60, y, f"Recommendation: {item['recommendation'][:90]}")
            y -= 20

            standards = [
                item["iso_standard"],
                item["nist_standard"],
                item["pci_standard"],
                item["soc2_standard"],
                item["gdpr_standard"],
                item["hipaa_standard"],
                item["cobit_standard"]
            ]

            standards = [std for std in standards if std]

            c.setFont("Helvetica-Bold", 10)
            c.drawString(60, y, "Compliance Mapping:")
            y -= 16

            c.setFont("Helvetica", 10)

            for std in standards:
                if y < 80:
                    c.showPage()
                    y = height - 50

                c.drawString(80, y, f"- {std[:85]}")
                y -= 14

            y -= 18

        c.save()

        return send_file(
            file_path,
            as_attachment=True
        )

    except Exception as e:
        print("PDF EXPORT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()