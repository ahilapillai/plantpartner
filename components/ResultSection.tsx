"use client";

import { AnalysisResult, HealthStatus, PlantType } from "@/types";
import ScoreDisplay from "./ScoreDisplay";

interface Props {
  loading: boolean;
  result: AnalysisResult | null;
}

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<HealthStatus, { label: string; bg: string; text: string }> = {
  healthy:    { label: "HEALTHY",    bg: "rgba(208,255,147,0.7)", text: "#2a5c1f" },
  disease:    { label: "DISEASE",    bg: "rgba(255,147,147,0.7)", text: "#7a1f1f" },
  care_issue: { label: "CARE ISSUE", bg: "rgba(255,235,147,0.7)", text: "#644c21" },
};

export default function ResultSection({ loading, result }: Props) {
  const cardClass = "w-full rounded-[25px] px-8 md:px-12 py-10 md:py-12 border border-[#284b22]";
  const cardStyle = { backgroundColor: "rgba(48, 81, 42, 0.6)" };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="pb-16">
        <div className={cardClass} style={cardStyle}>
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#d0ff93] rounded-full animate-spin" role="status" aria-label="Analyzing plant" />
            <p className="font-dm font-light text-[20px] text-white/80 text-center">Analysing your plant…</p>
            <p className="font-dm font-light text-[14px] text-white/50 text-center">
              Checking Plant.id · fetching local weather · running AI diagnosis
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!result) return null;

  // ── Artificial plant ───────────────────────────────────────────────────────
  if (result.plant_type === "artificial") {
    return (
      <section className="pb-16">
        <div className={cardClass} style={cardStyle}>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="text-[56px]">🌿</span>
            <h2 className="font-playfair text-[32px] md:text-[42px] font-normal text-white leading-tight">
              This looks like a plastic plant
            </h2>
            <p className="font-dm font-light text-[18px] md:text-[22px] text-white/75 max-w-sm">
              No watering needed — you&apos;re doing perfect already 😄
            </p>
            {result.explanation && (
              <p className="font-dm font-light text-[15px] text-white/50 max-w-md mt-2">{result.explanation}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const status = STATUS_CONFIG[result.health_status] ?? STATUS_CONFIG.care_issue;

  // ── Real / unsure plant ────────────────────────────────────────────────────
  return (
    <section className="pb-16 space-y-6">
      <div className={cardClass} style={cardStyle}>

        {/* ── Plant name / confidence header ── */}
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          {result.plant_type === "unsure" ? (
            <>
              <h2 className="font-playfair text-[32px] md:text-[46px] font-normal text-white/80 leading-tight">
                We couldn&apos;t confidently identify this plant
              </h2>
              <p className="font-dm font-light text-[18px] md:text-[22px] text-white/50">
                Analysis may be limited — try a clearer, closer photo
              </p>
            </>
          ) : result.confidence !== undefined && result.confidence >= 40 ? (
            <>
              <h2 className="font-playfair text-[32px] md:text-[46px] font-normal text-white leading-tight">
                {result.confidence >= 70 ? result.plant_name : `Possibly ${result.plant_name}`}
              </h2>
              <span
                className="inline-flex items-center gap-1.5 font-dm font-semibold text-[13px] tracking-wider px-4 py-1.5 rounded-full"
                style={{ backgroundColor: result.confidence >= 70 ? "rgba(208,255,147,0.25)" : "rgba(255,235,147,0.25)", color: result.confidence >= 70 ? "#d0ff93" : "#ffeb93" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: result.confidence >= 70 ? "#d0ff93" : "#ffeb93" }} />
                {result.confidence}% confidence
              </span>
            </>
          ) : (
            <>
              <h2 className="font-playfair text-[32px] md:text-[46px] font-normal text-white/80 leading-tight">
                Plant not confidently identified
              </h2>
              <p className="font-dm font-light text-[18px] md:text-[22px] text-white/50">
                Low confidence analysis — try a clearer image
              </p>
            </>
          )}
        </div>

        {/* ── Score + diagnosis row ── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start mb-10">

          {/* Score circle */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <ScoreDisplay score={result.score} />
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-px self-stretch bg-white/10" />

          {/* Diagnosis content */}
          <div className="flex-1 flex flex-col gap-4 w-full">

            {/* Badge + issue title */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center font-dm font-semibold text-[14px] tracking-widest px-4 py-2 rounded-full"
                style={{ backgroundColor: status.bg, color: status.text }}
              >
                {status.label}
              </span>
              <span className="font-dm font-bold text-[22px] md:text-[26px] text-white/90 leading-tight">
                {result.issue}
              </span>
            </div>

            {/* Explanation */}
            <p className="font-dm font-normal text-[17px] md:text-[20px] text-white/85 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </div>

        {/* ── What to do ── */}
        {result.solutions.length > 0 && (
          <div className="mb-10">
            <p className="font-dm font-bold text-[18px] md:text-[22px] text-white/90 mb-5">
              What to do
            </p>
            <ol className="flex flex-col gap-4">
              {result.solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center font-dm font-medium text-[15px] text-white mt-0.5"
                    style={{ backgroundColor: "#7ca575" }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-dm font-light text-[17px] md:text-[20px] text-white/85 leading-relaxed">
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── Weather + watering card ── */}
        {(result.location_tip || result.watering_days) && (
          <div
            className="w-full rounded-[20px] px-7 md:px-10 py-7 overflow-hidden"
            style={{ backgroundColor: "#314f2c" }}
          >
            <p className="font-dm font-bold text-[16px] md:text-[20px] text-white/90 mb-3">
              Based on weather conditions
            </p>

            {result.location_tip && (
              <p className="font-dm font-normal text-[15px] md:text-[18px] text-white/80 leading-relaxed mb-6">
                {result.location_tip}
              </p>
            )}

            {/* Watering interval */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="inline-flex items-center gap-2 font-dm font-semibold text-[15px] px-5 py-3 rounded-full self-start"
                style={{ backgroundColor: "rgba(255,235,147,0.7)", color: "#644c21" }}
              >
                💧 Next watering in {result.watering_days} day{result.watering_days !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="font-dm font-light text-[13px] text-white/45 mt-4 leading-relaxed">
              Always check soil moisture before watering. Conditions may vary.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
