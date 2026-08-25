import os
import sys
import argparse
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
from models import User

def main():
    parser = argparse.ArgumentParser(description="Manage Gravequit Admins")
    parser.add_argument("--promote", type=str, help="Email of the user to promote to admin")
    parser.add_argument("--demote", type=str, help="Email of the user to demote to student")
    parser.add_argument("--list", action="store_true", help="List all users and their roles")
    
    args = parser.parse_args()
    
    if not args.promote and not args.demote and not args.list:
        parser.print_help()
        sys.exit(1)
        
    db = SessionLocal()
    try:
        if args.promote:
            email = args.promote.strip().lower()
            user = db.query(User).filter(User.email == email).first()
            if not user:
                print(f"Error: User with email {email} not found.")
            else:
                user.role = "admin"
                db.commit()
                print(f"Success: {email} is now an admin.")
                
        if args.demote:
            email = args.demote.strip().lower()
            user = db.query(User).filter(User.email == email).first()
            if not user:
                print(f"Error: User with email {email} not found.")
            else:
                user.role = "student"
                db.commit()
                print(f"Success: {email} has been demoted to student.")
                
        if args.list:
            users = db.query(User).filter(User.role == 'admin').all()
            print("\n=== Gravequit Admins ===")
            print(f"{'Email':<35} | {'Role':<10}")
            print("-" * 50)
            for u in users:
                print(f"{u.email:<35} | {u.role:<10}")
            print("=======================\n")
    finally:
        db.close()

if __name__ == "__main__":
    main()
