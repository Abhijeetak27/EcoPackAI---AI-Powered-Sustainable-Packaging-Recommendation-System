import { materials, type PackagingMaterial, type ProductCategory } from "@/data/materials";

export interface ProductInput {
  name: string;
  category: ProductCategory;
  weight: number;
  length: number;
  width: number;
  height: number;
  fragility: number;
  shippingDistance: number;
}

export interface SustainabilityPreferences {
  ecoVsCost: number; // 0 = all cost, 100 = all eco
  minBiodegradability: number;
  maxCo2: number;
  requireRecyclable: boolean;
}

export interface RecommendationResult {
  material: PackagingMaterial;
  suitabilityScore: number;
  predictedCost: number;
  predictedCo2: number;
  ecoScore: number;
  costEfficiency: number;
  compositeScore: number;
}

function calculateVolume(l: number, w: number, h: number): number {
  return (l * w * h) / 1000; // dm³
}

function getDistanceFactor(distance: number): number {
  if (distance < 100) return 0.8;
  if (distance < 500) return 1.0;
  if (distance < 1500) return 1.3;
  return 1.6;
}

function getSuitabilityForCategory(material: PackagingMaterial, category: ProductCategory, fragility: number): number {
  let score = material.suitableFor.includes(category) ? 70 : 30;
  
  // Fragile items need higher strength
  if (fragility > 7) {
    score += (material.strength / 10) * 20;
  } else if (fragility > 4) {
    score += (material.strength / 10) * 10;
  } else {
    score += 10;
  }
  
  // Category-specific bonuses
  if (category === "Food & Beverage" && material.waterResistance >= 5) score += 10;
  if (category === "Pharmaceuticals" && material.shelfLife >= 24) score += 10;
  if (category === "Heavy Machinery" && material.weightCapacity >= 30) score += 15;
  if (category === "Fragile Items" && material.strength >= 6) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

export function getRecommendations(
  product: ProductInput,
  preferences: SustainabilityPreferences
): RecommendationResult[] {
  const volume = calculateVolume(product.length, product.width, product.height);
  const distFactor = getDistanceFactor(product.shippingDistance);
  
  const ecoWeight = preferences.ecoVsCost / 100;
  const costWeight = 1 - ecoWeight;

  const results: RecommendationResult[] = materials
    .filter((m) => {
      if (preferences.requireRecyclable && m.recyclability < 50) return false;
      if (m.biodegradabilityScore < preferences.minBiodegradability) return false;
      return true;
    })
    .map((material) => {
      const suitabilityScore = getSuitabilityForCategory(material, product.category, product.fragility);
      
      const predictedCo2 = material.co2Score * product.weight * distFactor * (1 + volume * 0.01);
      const predictedCost = material.costPerUnit * (1 + volume * 0.05) * (1 + product.weight * 0.02);
      
      // Normalize scores 0-100
      const maxCo2 = 5;
      const ecoScore = Math.max(0, 100 - (predictedCo2 / maxCo2) * 100);
      
      const maxCost = 100;
      const costEfficiency = Math.max(0, 100 - (predictedCost / maxCost) * 100);
      
      const compositeScore =
        suitabilityScore * 0.35 +
        ecoScore * 0.35 * ecoWeight +
        costEfficiency * 0.35 * costWeight +
        (material.biodegradabilityScore * 0.15) * ecoWeight +
        (material.recyclability * 0.15) * ecoWeight;

      return {
        material,
        suitabilityScore: Math.round(suitabilityScore),
        predictedCost: Math.round(predictedCost * 100) / 100,
        predictedCo2: Math.round(predictedCo2 * 1000) / 1000,
        ecoScore: Math.round(ecoScore),
        costEfficiency: Math.round(costEfficiency),
        compositeScore: Math.round(compositeScore * 10) / 10,
      };
    })
    .filter((r) => {
      if (preferences.maxCo2 > 0 && r.predictedCo2 > preferences.maxCo2) return false;
      return true;
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  return results;
}

export function getCo2Equivalent(co2Kg: number): string {
  const trees = Math.round(co2Kg / 21);
  const carKm = Math.round(co2Kg / 0.21);
  const phones = Math.round(co2Kg / 0.008);
  
  if (trees > 0) return `equivalent to planting ${trees} tree${trees > 1 ? 's' : ''}`;
  if (carKm > 10) return `equivalent to removing a car for ${carKm} km`;
  return `equivalent to charging ${phones} smartphones`;
}
