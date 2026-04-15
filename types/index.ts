export interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  link: string;
}

export type HealthStatus = "healthy" | "disease" | "care_issue";
export type PlantType = "real" | "artificial" | "unsure";
export type PlantCategory = "tropical" | "leafy" | "succulent" | "herb" | "flowering" | "unknown";

export interface AnalysisResult {
  plant_type: PlantType;        // real / artificial / unsure
  plant_category: PlantCategory;// for watering logic
  plant_name: string;
  confidence?: number;          // 0–100 from Plant.id
  health_status: HealthStatus;
  issue: string;                // single primary issue name
  explanation: string;          // 1–2 friendly sentences
  solutions: string[];          // 3–5 actionable steps
  location_tip: string;         // weather-aware tip
  score: number;                // 0–100 visual health score
  watering_days: number;        // computed watering interval in days
  products: Product[];
}
