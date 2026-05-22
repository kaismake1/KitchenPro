#!/usr/bin/env python3
"""
Reset database script - drops all tables and recreates them.
WARNING: This will delete all existing data!

Usage:
    python reset_database.py
"""

import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.db import reset_db, init_db
from backend.config import DATABASE_URL

def main():
    print("=" * 50)
    print("DATABASE RESET UTILITY")
    print("=" * 50)
    print(f"\nDatabase: {DATABASE_URL}")
    print("\nWARNING: This will DELETE ALL DATA in the database!")
    
    response = input("\nType 'yes' to confirm reset: ").strip().lower()
    
    if response == 'yes':
        try:
            print("\nResetting database...")
            
            # For SQLite, delete the actual database file
            if DATABASE_URL.startswith("sqlite"):
                # Extract database file path
                db_path = DATABASE_URL.replace("sqlite:///./", "").replace("sqlite:///", "")
                if os.path.exists(db_path):
                    os.remove(db_path)
                    print(f"✓ Deleted {db_path}")
                
                # Also delete WAL files if they exist
                for suffix in ["-shm", "-wal"]:
                    wal_path = db_path + suffix
                    if os.path.exists(wal_path):
                        os.remove(wal_path)
                        print(f"✓ Deleted {wal_path}")
            
            # Now recreate the database
            init_db()
            print("✓ Database reset successful!")
            print("\nAll tables have been recreated with the latest schema.")
            print("The database is now ready to use.")
            
            # Also seed initial data if available
            try:
                from backend.seed_data import seed_database
                print("\nSeeding initial data...")
                seed_database()
                print("✓ Database seeded successfully!")
            except Exception as e:
                print(f"Note: Could not seed initial data: {e}")
                
        except Exception as e:
            print(f"✗ Error resetting database: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)
    else:
        print("\nReset cancelled.")
        sys.exit(0)

if __name__ == "__main__":
    main()
