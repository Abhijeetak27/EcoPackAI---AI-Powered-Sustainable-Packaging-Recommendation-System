from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str


# ── Materials ─────────────────────────────────────────────────────────────────

class CostBreakdown(BaseModel):
    rawMaterial: float
    processing: float
    shipping: float


class MaterialOut(BaseModel):
    id: str
    name: str
    type: str
    biodegradabilityScore: float
    co2Score: float
    costPerUnit: float
    strength: float
    recyclability: float
    weightCapacity: float
    description: str
    waterResistance: float
    shelfLife: float
    suitableFor: List[str]
    costBreakdown: CostBreakdown


# ── Recommendations ───────────────────────────────────────────────────────────

class ProductInput(BaseModel):
    name: str
    category: str
    weight: float
    length: float
    width: float
    height: float
    fragility: float
    shippingDistance: float


class SustainabilityPreferences(BaseModel):
    ecoVsCost: float = 60       # 0=cost, 100=eco
    minBiodegradability: float = 0
    maxCo2: float = 10
    requireRecyclable: bool = False


class RecommendRequest(BaseModel):
    product: ProductInput
    preferences: SustainabilityPreferences


class RecommendationResult(BaseModel):
    material: MaterialOut
    suitabilityScore: float
    predictedCost: float
    predictedCo2: float
    ecoScore: float
    costEfficiency: float
    compositeScore: float


# ── Reports ───────────────────────────────────────────────────────────────────

class ReportSaveRequest(BaseModel):
    companyName: str
    industry: str
    data: dict


class ReportOut(BaseModel):
    id: str
    companyName: str
    industry: str
    data: dict
    createdAt: datetime
