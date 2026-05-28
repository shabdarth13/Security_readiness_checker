import psycopg2
from psycopg2.extras import RealDictCursor


def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="security_audit",
        user="postgres",
        password="7983434Abhi#",
        cursor_factory=RealDictCursor
    )
    return conn