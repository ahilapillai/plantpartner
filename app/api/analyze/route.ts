import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { PlantCategory } from "@/types";

// ── Watering logic ────────────────────────────────────────────────────────────
const BASE_WATERING_DAYS: Record<PlantCategory, number> = {
  tropical:  7,
  leafy:     5,
  succulent: 14,
  herb:      4,
  flowering: 6,
  unknown:   7,
};

function computeWateringDays(category: PlantCategory, temp: number, humidity: number): number {
  let days = BASE_WATERING_DAYS[category] ?? 7;
  if (temp > 30)    days -= 1;  // hot → dry out faster
  if (temp < 15)    days += 2;  // cool → slower evaporation
  if (humidity > 70) days += 1; // humid → retain moisture longer
  if (humidity < 40) days -= 1; // dry air → water sooner
  return Math.max(1, Math.min(days, 21));
}

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in .env.local");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const PLANTID_KEY = process.env.PLANTID_API_KEY;

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractJson(raw: string): Record<string, unknown> {
  const cleaned = raw
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();

  try { return JSON.parse(cleaned); } catch { /* fall through */ }

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch { /* fall through */ }
  }

  console.warn("[OpenAI] JSON parse failed. Raw:", raw.slice(0, 200));
  return {};
}

// ── Plant.id ──────────────────────────────────────────────────────────────────
async function identifyPlant(image: string) {
  const fallback = { plantName: "Unknown Plant", confidence: 0, isHealthy: true, topDisease: null as string | null, diseaseConfidence: 0 };
  if (!PLANTID_KEY) { console.warn("[Plant.id] API key not set"); return fallback; }

  try {
    const res = await fetch(
      "https://plant.id/api/v3/identification?details=common_names&disease_details=common_names,description",
      {
        method: "POST",
        headers: { "Api-Key": PLANTID_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ images: [image], health: "all" }),
      }
    );
    if (!res.ok) { console.error("[Plant.id]", res.status, await res.text()); return fallback; }

    const data = await res.json();
    const top = data.result?.classification?.suggestions?.[0];
    const isHealthy: boolean = data.result?.is_healthy?.binary ?? true;
    const plantName = top?.details?.common_names?.[0] ?? top?.name ?? "Unknown Plant";
    const confidence = Math.round((top?.probability ?? 0) * 100);

    let topDisease: string | null = null;
    let diseaseConfidence = 0;
    if (!isHealthy) {
      const d = data.result?.disease?.suggestions?.[0];
      if (d?.probability > 0.25) {
        topDisease = d.details?.common_names?.[0] ?? d.name ?? null;
        diseaseConfidence = Math.round(d.probability * 100);
      }
    }

    console.log(`[Plant.id] "${plantName}" ${confidence}% | healthy=${isHealthy} | disease=${topDisease}`);
    return { plantName, confidence, isHealthy, topDisease, diseaseConfidence };
  } catch (err) {
    console.error("[Plant.id]", err);
    return fallback;
  }
}

// ── Weather ───────────────────────────────────────────────────────────────────
async function getWeather(city: string) {
  const fallback = { temp: 28, humidity: 65, description: "Partly cloudy" };
  try {
    const encoded = encodeURIComponent(city);
    const res = await fetch(`https://wttr.in/${encoded}?format=j1`, { headers: { "User-Agent": "loveplants.ai/1.0" } });
    if (!res.ok) return fallback;
    const c = (await res.json()).current_condition?.[0];
    if (!c) return fallback;
    const weather = { temp: parseInt(c.temp_C ?? "28", 10), humidity: parseInt(c.humidity ?? "65", 10), description: c.weatherDesc?.[0]?.value ?? "Partly cloudy" };
    console.log(`[Weather] ${city}: ${weather.temp}°C ${weather.humidity}% — ${weather.description}`);
    return weather;
  } catch (err) {
    console.error("[Weather]", err);
    return fallback;
  }
}

// ── OpenAI diagnosis ──────────────────────────────────────────────────────────
async function synthesizeDiagnosis(
  image: string,
  plant: Awaited<ReturnType<typeof identifyPlant>>,
  weather: Awaited<ReturnType<typeof getWeather>>,
  locationLabel: string
) {
  // Only share the plant name with OpenAI if confidence is high enough.
  // If we hide the name here, OpenAI won't reference it in the explanation.
  const plantCtx = plant.confidence >= 40
    ? `Plant: "${plant.plantName}" (${plant.confidence}% confidence).`
    : "Plant identification confidence is too low to determine the species. Do NOT reference any plant name in your response.";

  const healthCtx = plant.isHealthy
    ? "Plant.id: plant looks healthy."
    : plant.topDisease
    ? `Plant.id detected disease: "${plant.topDisease}" (${plant.diseaseConfidence}%).`
    : "Plant.id: plant may be unhealthy.";

  const prompt = `You are a warm, friendly plant care expert.

FIRST — determine if this plant is real, artificial (plastic/fabric/silk), or unsure.
Look carefully for: overly perfect or identical leaves, unnatural shine or gloss, plastic texture, repeated patterns, no soil or roots visible, no natural imperfections.

${plantCtx}
${healthCtx}
Weather in ${locationLabel} today: ${weather.temp}°C, ${weather.humidity}% humidity, ${weather.description}.

Return ONLY this JSON (no markdown, no extra text):
{
  "plant_type": <"real" | "artificial" | "unsure">,
  "plant_category": <"tropical" | "leafy" | "succulent" | "herb" | "flowering" | "unknown" — set "unknown" if artificial>,
  "health_score": <0-100, set to 100 if artificial>,
  "health_status": <"healthy" | "disease" | "care_issue", set "healthy" if artificial>,
  "issue": <one short issue name, or "Looking Great!" if healthy or artificial>,
  "explanation": <1-2 friendly sentences — if artificial say something playful like "This beauty doesn't need water or sunlight — it's rocking the low-maintenance lifestyle!">,
  "solutions": <[] if artificial, otherwise exactly 4 short actionable steps>,
  "location_tip": <empty string if artificial, otherwise one tip referencing ${locationLabel} and using today's ${weather.temp}°C or ${weather.humidity}% humidity>
}`;

  const openai = getOpenAI();

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: image, detail: "auto" },
        ],
      },
    ],
  });

  const raw = response.output_text ?? "";
  console.log("[OpenAI] image length:", image.length);
  console.log("[OpenAI] raw response:", raw.slice(0, 400));

  const parsed = extractJson(raw);
  if (Object.keys(parsed).length === 0) {
    throw new Error("[OpenAI] Empty or unparseable response: " + raw.slice(0, 100));
  }
  return parsed;
}

// ── POST /api/analyze ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Read JSON body
  let body: { image?: string; location?: { city: string; region: string; country: string } | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const image = body.image ?? "";
  const loc = body.location;
  const city = loc?.city ?? "your city";
  const locationLabel = loc ? `${loc.city}, ${loc.region}, ${loc.country}` : "your area";
  console.log("[Route] location:", locationLabel);

  // 2. Validate image
  console.log("[Route] image length:", image.length, "| prefix:", image.slice(0, 60));
  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ success: false, error: "No valid base64 image provided" }, { status: 400 });
  }

  // 3. Plant.id + weather in parallel (use detected city for weather)
  const [plant, weather] = await Promise.all([
    identifyPlant(image),
    getWeather(city),
  ]);

  // 4. OpenAI vision diagnosis — let errors surface naturally, no silent swallowing
  let diagnosis: Record<string, unknown>;
  try {
    diagnosis = await synthesizeDiagnosis(image, plant, weather, locationLabel);
  } catch (err) {
    console.error("[Route] OpenAI failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }

  // 5. Compute watering days from category + weather
  const plantCategory = ((diagnosis.plant_category as string) ?? "unknown") as PlantCategory;
  const wateringDays = computeWateringDays(plantCategory, weather.temp, weather.humidity);

  // 6. Return structured result
  const plantType = (diagnosis.plant_type as string) ?? "real";
  return NextResponse.json({
    success: true,
    result: {
      plant_type:     plantType,
      plant_category: plantCategory,
      plant_name:     plant.plantName,
      confidence:     plant.confidence > 0 ? plant.confidence : undefined,
      health_status:  (diagnosis.health_status as string) ?? "care_issue",
      issue:          (diagnosis.issue         as string) ?? "Unknown",
      explanation:    (diagnosis.explanation   as string) ?? "",
      solutions:      (diagnosis.solutions     as string[]) ?? [],
      location_tip:   (diagnosis.location_tip  as string) ?? "",
      score:          (diagnosis.health_score  as number) ?? 50,
      watering_days:  wateringDays,
      products:       [],
    },
  });
}
