from config.db import get_db_connection

conn = get_db_connection()
cur = conn.cursor()

cur.execute("""
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name;
""")

for row in cur.fetchall():
    print(row)

cur.close()
conn.close()