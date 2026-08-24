from sqlalchemy.orm import Session

from auth import hash_password
from database import UserModel

DEMO_ACCOUNTS = [
    {"email": "sarah.jenkins@example.com", "full_name": "Sarah Jenkins"},
    {"email": "david.chen@example.com", "full_name": "David Chen"},
    {"email": "maya.patel@example.com", "full_name": "Maya Patel"},
]

DEMO_PASSWORD = "demo1234"


def seed_demo_accounts(db: Session) -> None:
    for acct in DEMO_ACCOUNTS:
        existing = db.query(UserModel).filter(UserModel.email == acct["email"]).first()
        if not existing:
            db.add(
                UserModel(
                    email=acct["email"],
                    password_hash=hash_password(DEMO_PASSWORD),
                    full_name=acct["full_name"],
                    auth_provider="password",
                )
            )
    db.commit()
