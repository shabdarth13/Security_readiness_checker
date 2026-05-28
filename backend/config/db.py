import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    conn = psycopg2.connect(
        database_url,
        cursor_factory=RealDictCursor
    )

    return conn