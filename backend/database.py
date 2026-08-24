from pathlib import Path
from datetime import datetime

from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = Path(__file__).resolve().parent / "aperio_data.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    auth_provider = Column(String, default="password")
    created_at = Column(DateTime, default=datetime.utcnow)


class SessionModel(Base):
    __tablename__ = "auth_sessions"

    token = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SavedReportModel(Base):
    __tablename__ = "saved_reports"

    id = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    date = Column(String, nullable=False)
    label = Column(String, nullable=False)
    results_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class JournalEntryModel(Base):
    __tablename__ = "journal_entries"

    id = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    entry_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserProfileModel(Base):
    __tablename__ = "user_profiles"

    user_email = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_type = Column(String, nullable=True)
    language = Column(String, default="en")
    measurement_units = Column(String, default="Conventional")
    timezone = Column(String, default="UTC")
    phone_number = Column(String, nullable=True)
    chronic_conditions_json = Column(Text, default="[]")
    other_chronic_conditions = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    primary_doctor_name = Column(String, nullable=True)
    primary_doctor_contact = Column(String, nullable=True)
    last_login = Column(String, nullable=True)
    onboarding_completed = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
