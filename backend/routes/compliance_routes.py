from flask import Blueprint, request, jsonify
from config.db import get_db_connection

compliance_bp = Blueprint("compliance", __name__)


@compliance_bp.route("/map/<int:user_id>", methods=["GET"])
def map_compliance(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT
                f.id,
                f.user_id,
                f.question_id,
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

        rows = cur.fetchall()

        result = []

        for row in rows:
            standards = []

            if row["iso_standard"]:
                standards.append(row["iso_standard"])

            if row["nist_standard"]:
                standards.append(row["nist_standard"])

            if row["pci_standard"]:
                standards.append(row["pci_standard"])

            if row["soc2_standard"]:
                standards.append(row["soc2_standard"])

            if row["gdpr_standard"]:
                standards.append(row["gdpr_standard"])

            if row["hipaa_standard"]:
                standards.append(row["hipaa_standard"])

            if row["cobit_standard"]:
                standards.append(row["cobit_standard"])

            if len(standards) == 0:
                standards.append("General Security Best Practices")

            result.append({
                "id": row["id"],
                "weakness": row["weakness"],
                "severity": row["severity"],
                "recommendation": row["recommendation"],
                "compliance_standards": standards
            })

        return jsonify(result)

    except Exception as e:
        print("COMPLIANCE ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()