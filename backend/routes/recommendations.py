from fastapi import APIRouter, Depends
from database import get_db
from models import RecommendRequest, RecommendationResult, MaterialOut
from routes.auth import get_current_user
from ml.predictor import predict_scores

router = APIRouter(prefix="/api/recommend", tags=["recommendations"])


def _calc_suitability(material: dict, category: str, fragility: float) -> float:
    score = 70.0 if category in material["suitableFor"] else 30.0
    if fragility > 7:
        score += (material["strength"] / 10) * 20
    elif fragility > 4:
        score += (material["strength"] / 10) * 10
    else:
        score += 10

    if category == "Food & Beverage" and material["waterResistance"] >= 5:
        score += 10
    if category == "Pharmaceuticals" and material["shelfLife"] >= 24:
        score += 10
    if category == "Heavy Machinery" and material["weightCapacity"] >= 30:
        score += 15
    if category == "Fragile Items" and material["strength"] >= 6:
        score += 10

    return min(100.0, max(0.0, score))


@router.post("", response_model=list[RecommendationResult])
async def recommend(body: RecommendRequest):
    db = get_db()
    p = body.product
    prefs = body.preferences

    # Volume in dm³
    volume = (p.length * p.width * p.height) / 1000
    dist_factor = (
        0.8 if p.shippingDistance < 100
        else 1.0 if p.shippingDistance < 500
        else 1.3 if p.shippingDistance < 1500
        else 1.6
    )

    eco_w = prefs.ecoVsCost / 100
    cost_w = 1 - eco_w

    materials = await db["materials"].find().to_list(length=200)

    results = []
    for m in materials:
        # Hard filters
        if prefs.requireRecyclable and m["recyclability"] < 50:
            continue
        if m["biodegradabilityScore"] < prefs.minBiodegradability:
            continue

        suitability = _calc_suitability(m, p.category, p.fragility)

        # Use ML model to predict cost & co2
        predicted_co2, predicted_cost = predict_scores(
            weight=p.weight,
            volume=volume,
            dist_factor=dist_factor,
            co2_base=m["co2Score"],
            cost_base=m["costPerUnit"],
        )

        if prefs.maxCo2 > 0 and predicted_co2 > prefs.maxCo2:
            continue

        eco_score = max(0.0, 100 - (predicted_co2 / 5) * 100)
        cost_eff = max(0.0, 100 - (predicted_cost / 100) * 100)

        composite = (
            suitability * 0.35
            + eco_score * 0.35 * eco_w
            + cost_eff * 0.35 * cost_w
            + m["biodegradabilityScore"] * 0.15 * eco_w
            + m["recyclability"] * 0.15 * eco_w
        )

        results.append(RecommendationResult(
            material=MaterialOut(**{**m, "id": m["id"], "costBreakdown": m["costBreakdown"]}),
            suitabilityScore=round(suitability),
            predictedCost=round(predicted_cost, 2),
            predictedCo2=round(predicted_co2, 3),
            ecoScore=round(eco_score),
            costEfficiency=round(cost_eff),
            compositeScore=round(composite, 1),
        ))

    results.sort(key=lambda r: r.compositeScore, reverse=True)
    return results[:8]
