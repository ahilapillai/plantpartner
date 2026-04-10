"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Vine from "@/components/Vine";
import UploadCard from "@/components/UploadCard";
import FeatureIcons from "@/components/FeatureIcons";
import Testimonial from "@/components/Testimonial";
import PhotoGrid from "@/components/PhotoGrid";
import Footer from "@/components/Footer";
import ResultSection from "@/components/ResultSection";
import { AnalysisResult } from "@/types";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);  // base64 data URI
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // UploadCard passes the base64 data URI directly
  const handleFileChange = (base64: string) => {
    setBase64Image(base64);
    setPreview(base64);   // reuse as preview — no separate object URL needed
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    try {
      console.log("[Page] sending base64 image:", base64Image.slice(0, 60));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      const json = await res.json();
      console.log("[Page] API response:", json);
      if (!json.success) throw new Error(json.error ?? "Analysis failed");
      const data: AnalysisResult = json.result;
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      console.error("[Page] Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#5e8557]">

      {/* ── Vine — fixed to viewport right edge, purely decorative ── */}
      <Vine />

      {/* ── All page content — z-10 sits above the vine ── */}
      <div className="relative z-10">

        {/* ════════════════════════════════════════
            HERO — navbar + headline + upload card
        ════════════════════════════════════════ */}
        <section>
          {/* Navbar — logo pinned to the left edge */}
          <nav className="w-full px-6 md:px-10 py-6">
            <Link href="/" aria-label="Go to home">
              <Logo />
            </Link>
          </nav>

          {/* Headline — centered */}
          <div className="w-full max-w-[860px] mx-auto px-4 pt-2 pb-10 text-center">
            <h1 className="font-playfair text-[36px] md:text-[50px] font-normal text-white leading-tight tracking-tight">
              Every plant deserves a{" "}
              <em className="font-extrabold italic">little more love.</em>
            </h1>
          </div>

          {/* Upload card — centered, full width up to max */}
          <div className="w-full max-w-[1026px] mx-auto px-4 md:px-6 pb-16">
            <UploadCard
              preview={preview}
              onFileChange={handleFileChange}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>
        </section>

        {/* ════════════════════════════════
            FEATURE ICONS
        ════════════════════════════════ */}
        <section className="w-full max-w-[1026px] mx-auto px-4 md:px-6 pb-24">
          <FeatureIcons />
        </section>

        {/* ════════════════════════════════
            ANALYSIS RESULT (post-upload)
        ════════════════════════════════ */}
        {(loading || result) && (
          <div ref={resultRef} className="scroll-mt-8 w-full max-w-[1026px] mx-auto px-4 md:px-6 pb-4">
            <ResultSection loading={loading} result={result} />
          </div>
        )}

        {/* ════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════ */}
        <section className="w-full max-w-[1026px] mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <Testimonial />
        </section>

        {/* ════════════════════════════════
            PHOTO GRID — full bleed
        ════════════════════════════════ */}
        <PhotoGrid />

        {/* ════════════════════════════════
            FOOTER
        ════════════════════════════════ */}
        <Footer />

      </div>
    </main>
  );
}
