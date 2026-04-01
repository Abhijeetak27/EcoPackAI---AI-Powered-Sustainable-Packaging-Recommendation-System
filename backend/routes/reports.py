import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models import ReportSaveRequest, ReportOut
from routes.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("", response_model=ReportOut)
async def save_report(body: ReportSaveRequest, user=Depends(get_current_user)):
    db = get_db()
    doc = {
        "_id": str(uuid.uuid4()),
        "user_id": str(user["_id"]),
        "companyName": body.companyName,
        "industry": body.industry,
        "data": body.data,
        "createdAt": datetime.utcnow(),
    }
    await db["reports"].insert_one(doc)
    return ReportOut(
        id=doc["_id"],
        companyName=doc["companyName"],
        industry=doc["industry"],
        data=doc["data"],
        createdAt=doc["createdAt"],
    )


@router.get("", response_model=list[ReportOut])
async def list_reports(user=Depends(get_current_user)):
    db = get_db()
    docs = await db["reports"].find(
        {"user_id": str(user["_id"])}
    ).sort("createdAt", -1).to_list(length=50)
    return [
        ReportOut(
            id=d["_id"],
            companyName=d["companyName"],
            industry=d["industry"],
            data=d["data"],
            createdAt=d["createdAt"],
        )
        for d in docs
    ]
