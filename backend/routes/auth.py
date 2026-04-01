import os
import uuid
import secrets
from datetime import datetime
from fastapi import APIRouter, Response, Request, HTTPException, Depends
from passlib.context import CryptContext

from database import get_db
from models import RegisterRequest, LoginRequest, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

COOKIE_NAME = "session_id"


# ── Helpers ───────────────────────────────────────────────────────────────────

async def get_current_user(request: Request):
    """Dependency: returns user dict or raises 401."""
    session_id = request.cookies.get(COOKIE_NAME)
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db = get_db()
    session = await db["sessions"].find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db["users"].find_one({"_id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserOut)
async def register(body: RegisterRequest, response: Response):
    db = get_db()

    existing = await db["users"].find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "_id": str(uuid.uuid4()),
        "email": body.email,
        "password_hash": pwd_context.hash(body.password),
        "created_at": datetime.utcnow(),
    }
    await db["users"].insert_one(user_doc)

    session_id = secrets.token_urlsafe(32)
    await db["sessions"].insert_one({
        "session_id": session_id,
        "user_id": user_doc["_id"],
        "created_at": datetime.utcnow(),
    })

    response.set_cookie(
        key=COOKIE_NAME,
        value=session_id,
        httponly=True,
        samesite="lax",
        secure=os.getenv("ENV", "dev") == "prod",
    )
    return UserOut(id=user_doc["_id"], email=user_doc["email"])


@router.post("/login", response_model=UserOut)
async def login(body: LoginRequest, response: Response):
    db = get_db()

    user = await db["users"].find_one({"email": body.email})
    if not user or not pwd_context.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session_id = secrets.token_urlsafe(32)
    await db["sessions"].insert_one({
        "session_id": session_id,
        "user_id": user["_id"],
        "created_at": datetime.utcnow(),
    })

    response.set_cookie(
        key=COOKIE_NAME,
        value=session_id,
        httponly=True,
        samesite="lax",
        secure=os.getenv("ENV", "dev") == "prod",
    )
    return UserOut(id=str(user["_id"]), email=user["email"])


@router.post("/logout")
async def logout(request: Request, response: Response):
    session_id = request.cookies.get(COOKIE_NAME)
    if session_id:
        db = get_db()
        await db["sessions"].delete_one({"session_id": session_id})
    response.delete_cookie(COOKIE_NAME)
    return {"message": "Logged out"}


@router.get("/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return UserOut(id=str(user["_id"]), email=user["email"])
