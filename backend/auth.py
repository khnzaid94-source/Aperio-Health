import re
import secrets
from datetime import datetime, timedelta

import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from database import get_db, UserModel, SessionModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

bearer_scheme = HTTPBearer(auto_error=False)

SESSION_MAX_AGE_DAYS = 30
MIN_PASSWORD_LENGTH = 8

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    full_name: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=1)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def _validate_password_strength(password: str) -> None:
    if len(password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Password must be at least {MIN_PASSWORD_LENGTH} characters long.",
        )


def _create_session(db: Session, email: str) -> str:
    db.query(SessionModel).filter(
        SessionModel.created_at < datetime.utcnow() - timedelta(days=SESSION_MAX_AGE_DAYS)
    ).delete()
    token = secrets.token_urlsafe(32)
    db.add(SessionModel(token=token, user_email=email.lower()))
    db.commit()
    return token


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> str:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated. Please sign in.")
    session = (
        db.query(SessionModel)
        .filter(SessionModel.token == credentials.credentials)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=401,
            detail="Session expired or invalid. Please sign in again.",
        )
    return session.user_email


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    _validate_password_strength(payload.password)
    email = payload.email.lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if db.query(UserModel).filter(UserModel.email == email).first():
        raise HTTPException(
            status_code=409, detail="An account with this email already exists."
        )
    user = UserModel(
        email=email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip() or email.split("@")[0],
        auth_provider="password",
    )
    db.add(user)
    db.commit()
    token = _create_session(db, email)
    return {"token": token, "user_email": email, "full_name": user.full_name}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    token = _create_session(db, email)
    return {"token": token, "user_email": email, "full_name": user.full_name}


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials and credentials.credentials:
        db.query(SessionModel).filter(SessionModel.token == credentials.credentials).delete()
        db.commit()
    return {"status": "logged_out"}


@router.post("/logout-all")
def logout_all(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = (
        db.query(SessionModel)
        .filter(SessionModel.user_email == current_user)
        .delete()
    )
    db.commit()
    return {"status": "logged_out_all", "sessions_ended": deleted}


@router.put("/password")
def change_password(
    payload: PasswordChangeRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _validate_password_strength(payload.new_password)
    user = db.query(UserModel).filter(UserModel.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="Account not found.")
    if not user.password_hash or not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"status": "password_changed"}
