"""
One-time database migration script:
Adds `parent_item_id` column and index to `items` table.
Run this script against your live Postgres database (or execute the raw SQL below in your provider's SQL console):

SQL to run in Postgres console:
    ALTER TABLE items ADD COLUMN IF NOT EXISTS parent_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_items_parent_item_id ON items(parent_item_id);
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

from sqlalchemy import text
from database import engine

def run_migration():
    print("Running migration: adding parent_item_id to items table...")
    with engine.connect() as conn:
        dialect = engine.dialect.name
        if dialect == "postgresql":
            conn.execute(text("ALTER TABLE items ADD COLUMN IF NOT EXISTS parent_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL;"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_items_parent_item_id ON items(parent_item_id);"))
        else:
            try:
                conn.execute(text("ALTER TABLE items ADD COLUMN parent_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL;"))
            except Exception as e:
                print(f"Column notice: {e}")
            try:
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_items_parent_item_id ON items(parent_item_id);"))
            except Exception as e:
                print(f"Index notice: {e}")
        conn.commit()
    print("Migration successfully completed.")

if __name__ == "__main__":
    run_migration()
