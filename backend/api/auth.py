from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from backend.db import get_db
from backend.models.orm import User
from backend.services.auth import (
    hash_password, verify_password, create_access_token, verify_token
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    access_token: str


@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user."""
    # Check if user already exists
    existing = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Create user
    user = User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create token
    token = create_access_token({"sub": user.id, "username": user.username})

    return AuthResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        access_token=token,
    )


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Login user."""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id, "username": user.username})

    return AuthResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        access_token=token,
    )


@router.get("/me")
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get current authenticated user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Parse "Bearer {token}" format
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    }
