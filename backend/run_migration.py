import sys
import logging
import psycopg2
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("migration")

def run_migration():
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    if not schema_path.exists():
        logger.error("schema.sql not found!")
        return False

    with open(schema_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    logger.info("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(settings.DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    try:
        logger.info("Executing schema.sql on Supabase...")
        cursor.execute(sql_content)
        logger.info("Migration executed successfully!")

        # Verify created tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"Verified tables in public schema: {tables}")
        return True
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    success = run_migration()
    if not success:
        exit(1)
