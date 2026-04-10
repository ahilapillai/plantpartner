import { AnalysisResult, HealthStatus, PlantType } from "@/types";
import ScoreDisplay from "./ScoreDisplay";

interface Props {
  loading: boolean;
  result: AnalysisResult | null;
}

// ── Health status config ──────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  HealthStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  healthy:    { label: "Healthy",    bg: "bg-[#d0ff93]/15", text: "text-[#d0ff93]",  dot: "bg-[#d0ff93]" },
  disease:    { label: "Disease",    bg: "bg-red-400/15",   text: "text-red-300",    dot: "bg-red-400"   },
  care_issue: { label: "Care Issue", bg: "bg-amber-300/15", text: "text-amber-300",  dot: "bg-amber-300" },
};

export default function ResultSection({ loading, result }: Props) {

  const cardClass = "w-full rounded-[25px] px-8 md:px-12 py-10 md:py-12 border border-[#284b22]";
  const cardStyle = { backgroundColor: "rgba(48, 81, 42, 0.6)" };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="pb-16">
        <div className={cardClass} style={cardStyle}>
          <div className="flex flex-col items-center gap-6">
            <div
              className="w-12 h-12 border-4 border-white/20 border-t-[#d0ff93] rounded-full animate-spin"
              role="status"
              aria-label="Analyzing plant"
            />
            <p className="font-dm font-light text-[20px] text-white/80 text-center">
              Analysing your plant…
            </p>
            <p className="font-dm font-light text-[14px] text-white/50 text-center">
              Checking Plant.id · fetching Bangalore weather · running AI diagnosis
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!result) return null;

  // ── Artificial plant — special card ───────────────────────────────────────
  if (result.plant_type === "artificial") {
    return (
      <section className="pb-16">
        <div className={cardClass} style={cardStyle}>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="text-[56px]">🌿</span>
            <h2 className="font-playfair text-[26px] md:text-[34px] font-normal text-white leading-tight">
              This looks like a plastic plant
            </h2>
            <p className="font-dm font-light text-[16px] md:text-[18px] text-white/75 max-w-sm">
              No watering needed — you&apos;re doing perfect already 😄
            </p>
            {result.explanation && (
              <p className="font-dm font-light text-[14px] text-white/50 max-w-md mt-2">
                {result.explanation}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const status = STATUS_CONFIG[result.health_status] ?? STATUS_CONFIG.care_issue;

  // ── Result state ───────────────────────────────────────────────────────────
  return (
    <section className="pb-16 space-y-6">

      {/* ── Main diagnosis card — same style as upload box ── */}
      <div className={cardClass} style={cardStyle}>

        {/* Plant name — confidence-gated display */}
        <div className="flex flex-col items-center gap-2 mb-10">
          {result.plant_type === "unsure" ? (
            <>
              <h2 className="font-playfair text-[24px] md:text-[32px] font-normal text-white/75 text-center leading-tight">
                We couldn&apos;t confidently identify this plant
              </h2>
              <p className="font-dm font-light text-[13px] text-white/45 text-center">
                Analysis may be limited — try a clearer, closer photo
              </p>
            </>
          ) : result.confidence !== undefined && result.confidence >= 40 ? (
            <>
              <h2 className="font-playfair text-[26px] md:text-[36px] font-normal text-white text-center leading-tight">
                {result.confidence >= 70
                  ? result.plant_name
                  : `Possibly ${result.plant_name}`}
              </h2>
              <span className={`inline-flex items-center gap-1.5 font-dm text-[12px] font-medium tracking-wide px-3 py-1 rounded-full ${
                result.confidence >= 70
                  ? "bg-[#d0ff93]/20 text-[#d0ff93]"
                  : "bg-amber-300/20 text-amber-300"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${result.confidence >= 70 ? "bg-[#d0ff93]" : "bg-amber-300"}`} />
                {result.confidence}% confidence
              </span>
            </>
          ) : (
            <>
              <h2 className="font-playfair text-[24px] md:text-[32px] font-normal text-white/75 text-center leading-tight">
                Plant not confidently identified
              </h2>
              <p className="font-dm font-light text-[13px] text-white/45 text-center">
                Low confidence analysis — try a clearer image
              </p>
            </>
          )}
        </div>

        {/* Score + diagnosis side by side */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">

          {/* Health score circle */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <ScoreDisplay score={result.score} />
          </div>

          {/* Vertical divider (desktop) */}
          <div className="hidden md:block w-px self-stretch bg-white/10" />

          {/* Diagnosis details */}
          <div className="flex-1 flex flex-col gap-6 w-full">

            {/* Status badge + issue name */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 text-[12px] font-dm font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full ${status.bg} ${status.text}`}>
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="font-playfair text-[22px] md:text-[26px] text-white leading-tight">
                {result.issue}
              </span>
            </div>

            {/* Explanation */}
            <p className="font-dm font-light text-[16px] md:text-[17px] text-white/80 leading-relaxed">
              {result.explanation}
            </p>

            {/* Solutions */}
            {result.solutions.length > 0 && (
              <div>
                <Label>What to do</Label>
                <ol className="flex flex-col gap-3 mt-3">
                  {result.solutions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#d0ff93]/20 text-[#d0ff93] font-dm font-bold text-[12px] flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-dm font-light text-[15px] md:text-[16px] text-white/85 leading-snug">
                        {s}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Location tip — weather callout */}
            {result.location_tip && (
              <div className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-[14px] px-5 py-4 mt-1">
                <span className="text-[20px] flex-shrink-0 mt-0.5">🌤️</span>
                <div>
                  <p className="font-dm font-medium text-[11px] tracking-[0.15em] uppercase text-[#d0ff93] mb-1">
                    Bangalore weather tip
                  </p>
                  <p className="font-dm font-light text-[14px] md:text-[15px] text-white/75 leading-relaxed">
                    {result.location_tip}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-dm font-medium text-[11px] tracking-[0.15em] uppercase text-[#d0ff93]">
      {children}
    </p>
  );
}
