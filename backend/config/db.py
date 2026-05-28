import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        conn = psycopg2.connect(
            database_url,
            cursor_factory=RealDictCursor
        )
    else:
        conn = psycopg2.connect(
            host="localhost",
            database="security_audit",
            user="postgres",
            password="7983434Abhi#",
            cursor_factory=RealDictCursor
        )

    return conn