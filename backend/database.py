import os
import json
from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./aperio_data.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

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
    entry_type = Column(String, nullable=False) # 'medication' | 'supplement' | 'lifestyle'
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
