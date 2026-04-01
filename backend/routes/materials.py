from fastapi import APIRouter, Depends
from database import get_db
from models import MaterialOut
from routes.auth import get_current_user

router = APIRouter(prefix="/api/materials", tags=["materials"])


def _serialize(doc) -> MaterialOut:
    return MaterialOut(
        id=doc["id"],
        name=doc["name"],
        type=doc["type"],
        biodegradabilityScore=doc["biodegradabilityScore"],
        co2Score=doc["co2Score"],
        costPerUnit=doc["costPerUnit"],
        strength=doc["strength"],
        recyclability=doc["recyclability"],
        weightCapacity=doc["weightCapacity"],
        description=doc["description"],
        waterResistance=doc["waterResistance"],
        shelfLife=doc["shelfLife"],
        suitableFor=doc["suitableFor"],
        costBreakdown=doc["costBreakdown"],
    )


@router.get("", response_model=list[MaterialOut])
async def get_materials():
    db = get_db()
    docs = await db["materials"].find().to_list(length=200)
    return [_serialize(d) for d in docs]
