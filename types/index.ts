export interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  link: string;
}

export type HealthStatus = "healthy" | "disease" | "care_issue";
export type PlantType = "real" | "artificial" | "unsure";

export interface AnalysisResult {
  plant_type: PlantType;        // real / artificial / unsure
  plant_name: string;
  confidence?: number;          // 0–100 from Plant.id
  health_status: HealthStatus;
  issue: string;                // single primary issue name
  explanation: string;          // 1–2 friendly sentences
  solutions: string[];          // 3–5 actionable steps
  location_tip: string;         // weather-aware tip for Bangalore
  score: number;                // 0–100 visual health score
  products: Product[];          // optional product recommendations
}
