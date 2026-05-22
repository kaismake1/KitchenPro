"""
Migration script to add shipper_phone column to orders table.
Run this script after updating the ORM model.
"""

from sqlalchemy import text
from backend.db import engine, init_db
from backend.config import DATABASE_URL

def migrate_shipper_phone():
    """Add shipper_phone column to orders table if it doesn't exist."""
    
    try:
        with engine.connect() as conn:
            # Check database type
            if DATABASE_URL.startswith("sqlite"):
                # SQLite - check if column exists
                result = conn.execute(
                    text("PRAGMA table_info(orders)")
                ).fetchall()
                
                column_names = [row[1] for row in result]
                
                if "shipper_phone" not in column_names:
                    print("Adding shipper_phone column to orders table...")
                    conn.execute(
                        text("ALTER TABLE orders ADD COLUMN shipper_phone VARCHAR")
                    )
                    conn.commit()
                    print("✓ Successfully added shipper_phone column")
                else:
                    print("✓ shipper_phone column already exists")
                    
            elif "mysql" in DATABASE_URL.lower():
                # MySQL
                try:
                    conn.execute(
                        text("ALTER TABLE orders ADD COLUMN shipper_phone VARCHAR(255)")
                    )
                    conn.commit()
                    print("✓ Successfully added shipper_phone column")
                except Exception as e:
                    if "Duplicate column name" in str(e):
                        print("✓ shipper_phone column already exists")
                    else:
                        raise
                        
            elif "postgres" in DATABASE_URL.lower():
                # PostgreSQL
                try:
                    conn.execute(
                        text("ALTER TABLE orders ADD COLUMN shipper_phone VARCHAR(255)")
                    )
                    conn.commit()
                    print("✓ Successfully added shipper_phone column")
                except Exception as e:
                    if "already exists" in str(e):
                        print("✓ shipper_phone column already exists")
                    else:
                        raise
                        
    except Exception as e:
        print(f"Error during migration: {e}")
        print("\nAlternative solution:")
        print("1. Delete the current database file (if using SQLite)")
        print("2. Restart the backend server")
        print("3. The database will be recreated with the new schema")

if __name__ == "__main__":
    print("Starting migration...")
    migrate_shipper_phone()
    print("Migration complete!")
