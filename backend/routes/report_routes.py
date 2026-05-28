from flask import Blueprint, request, jsonify
from config.db import get_db_connection
from services.gap_detector import detect_gaps

report_bp = Blueprint("report", __name__)


@report_bp.route("/generate", methods=["POST"])
def generate_report():
    data = request.json

    responses = data.get("responses", [])
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({
            "error": "User ID is required"
        }), 400

    findings = detect_gaps(responses)

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            DELETE FROM findings
            WHERE user_id = %s
            """,
            (user_id,)
        )

        for item in findings:
            cur.execute(
                """
                INSERT INTO findings
                (
                    user_id,
                    question_id,
                    weakness,
                    severity,
                    recommendation
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    item["question_id"],
                    item["weakness"],
                    item["severity"],
                    item["recommendation"]
                )
            )

        conn.commit()

        return jsonify({
            "message": "Fresh report generated successfully",
            "findings": findings
        })

    except Exception as e:
        conn.rollback()
        print("REPORT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


@report_bp.route("/all/<int:user_id>", methods=["GET"])
def get_reports(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT *
            FROM findings
            WHERE user_id = %s
            ORDER BY id DESC
            """,
            (user_id,)
        )

        reports = cur.fetchall()

        return jsonify(reports)

    except Exception as e:
        print("FETCH REPORT ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()