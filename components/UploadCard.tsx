"use client";

import { useState, useRef } from "react";
import { IconLeaf, IconLoader2 } from "@tabler/icons-react";

interface Props {
  preview: string | null;          // base64 data URL shown in <img>
  onFileChange: (base64: string) => void;  // sends base64 up to page
  onAnalyze: () => void;
  loading: boolean;
}

export default function UploadCard({ preview, onFileChange, onAnalyze, loading }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  /** Convert a File to a base64 data URI via FileReader, then call onFileChange */
  const readAsBase64 = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      console.log("[UploadCard] base64 preview:", base64.slice(0, 60));
      onFileChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readAsBase64(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readAsBase64(file);
  };

  return (
    <div
      className="w-full max-w-[1026px] rounded-[25px] px-10 py-10 md:py-12 border border-[#284b22]"
      style={{ backgroundColor: "rgba(48, 81, 42, 0.6)" }}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {!preview ? (
        /* ── Drop Zone ── */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload plant photo"
          onClick={openPicker}
          onKeyDown={(e) => e.key === "Enter" && openPicker()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-5 min-h-[150px] cursor-pointer select-none transition-opacity ${
            dragging ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="w-[52px] h-[52px] bg-[#e7ffc7] rounded-[14px] flex items-center justify-center flex-shrink-0">
            <IconLeaf size={30} stroke={1.5} color="#4c7a44" />
          </div>
          <p className="font-dm font-light text-[22px] md:text-[25px] text-white/90 text-center leading-snug max-w-md">
            Drop your plant photo here or tap to choose from gallery
          </p>
          <p className="font-dm font-extralight text-[16px] md:text-[18px] text-white/90 text-center">
            JPG, PNG supported
          </p>
        </div>
      ) : (
        /* ── Preview State ── */
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full max-w-[500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Plant preview"
              className="w-full max-h-[320px] object-contain rounded-[16px]"
            />
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="bg-[#d0ff93] text-[#3a5c32] font-dm font-bold text-[17px] px-12 py-3 rounded-full transition-all select-none hover:bg-[#c2f57e] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <IconLoader2 size={18} className="animate-spin" />
                Analyzing…
              </span>
            ) : (
              "Analyze Plant"
            )}
          </button>

          <button
            onClick={openPicker}
            className="text-white/60 font-dm text-sm underline underline-offset-2 hover:text-white/90 transition-colors"
          >
            Choose a different image
          </button>
        </div>
      )}
    </div>
  );
}
