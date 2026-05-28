from flask import Blueprint, request, jsonify
from config.db import get_db_connection

question_bp = Blueprint("question", __name__)


# =====================================
# GET ALL QUESTIONS
# =====================================
@question_bp.route("/", methods=["GET"])
def get_questions():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT * FROM questions ORDER BY id ASC")
        rows = cur.fetchall()

        questions = []

        for row in rows:
            print("ROW:", row)

            questions.append({
                "id": row["id"],
                "domain": row["domain"],
                "question": row["question"],
                "weight": row["weight"]
            })

        return jsonify(questions)

    except Exception as e:
        print("REAL ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# =====================================
# ADD QUESTION + FULL COMPLIANCE MAPPING
# =====================================
@question_bp.route("/add", methods=["POST"])
def add_question():
    data = request.json

    domain = data.get("domain")
    question = data.get("question")
    weight = data.get("weight")

    iso_standard = data.get("iso_standard")
    nist_standard = data.get("nist_standard")
    pci_standard = data.get("pci_standard")

    soc2_standard = data.get("soc2_standard")
    gdpr_standard = data.get("gdpr_standard")
    hipaa_standard = data.get("hipaa_standard")
    cobit_standard = data.get("cobit_standard")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Step 1 → Insert into questions table
        cur.execute(
            """
            INSERT INTO questions
            (domain, question, weight)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (domain, question, weight)
        )

        # Since using RealDictCursor
        question_id = cur.fetchone()["id"]

        # Step 2 → Insert into compliance mapping table
        cur.execute(
            """
            INSERT INTO question_compliance_mapping
            (
                question_id,
                iso_standard,
                nist_standard,
                pci_standard,
                soc2_standard,
                gdpr_standard,
                hipaa_standard,
                cobit_standard
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                question_id,
                iso_standard,
                nist_standard,
                pci_standard,
                soc2_standard,
                gdpr_standard,
                hipaa_standard,
                cobit_standard
            )
        )

        conn.commit()

        return jsonify({
            "message": "Question + Full Compliance Mapping Added Successfully"
        })

    except Exception as e:
        conn.rollback()

        print("ADD QUESTION ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()