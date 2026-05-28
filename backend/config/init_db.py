from db import get_db_connection

conn = get_db_connection()
cur = conn.cursor()

with open("../database/schema.sql", "r") as file:
    sql = file.read()

cur.execute(sql)

conn.commit()

cur.close()
conn.close()

print("Database schema created successfully!")
