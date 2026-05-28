from flask import Blueprint, request, jsonify
from config.db import get_db_connection

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/add-question", methods=["POST"])
def add_question():
    data = request.json

    domain = data.get("domain")
    question = data.get("question")
    weight = data.get("weight")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO questions (domain, question, weight)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (domain, question, weight)
        )

        question_id = cur.fetchone()["id"]

        conn.commit()

        return jsonify({
            "message": "Question added successfully",
            "question_id": question_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


@admin_bp.route("/all-users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, name, email, role
            FROM users
            ORDER BY id DESC
        """)

        users = cur.fetchall()

        return jsonify(users)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()