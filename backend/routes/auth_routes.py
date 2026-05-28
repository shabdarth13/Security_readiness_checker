from flask import Blueprint, request, jsonify
from config.db import get_db_connection

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    role = "user"

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (name, email, password, role)
        )

        user_id = cur.fetchone()["id"]

        conn.commit()

        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": role
            }
        }), 201

    except Exception as e:
        conn.rollback()

        print("REGISTER ERROR:", str(e))

        if "duplicate key value" in str(e):
            return jsonify({
                "error": "Email already registered"
            }), 409

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT id, name, email, role
            FROM users
            WHERE email = %s AND password = %s
            """,
            (email, password)
        )

        user = cur.fetchone()

        if not user:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()