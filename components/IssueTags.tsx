/**
 * IssueTags — renders each detected issue as a soft pill/chip
 * Colour cycles through a warm set to keep visual variety
 */

const palette = [
  { bg: "#ffcbcb", text: "#6b2020" }, // rose
  { bg: "#ffe5c2", text: "#6b3c10" }, // amber
  { bg: "#ffd6f0", text: "#6b1b52" }, // pink
  { bg: "#d4f0ff", text: "#0f4a6b" }, // sky (rarely used — more issues)
];

interface Props {
  issues: string[];
}

export default function IssueTags({ issues }: Props) {
  if (!issues.length) return null;

  return (
    <div className="flex flex-wrap gap-3" role="list" aria-label="Detected issues">
      {issues.map((issue, i) => {
        const { bg, text } = palette[i % palette.length];
        return (
          <span
            key={i}
            role="listitem"
            className="px-4 py-1.5 rounded-full font-dm font-medium text-[14px] leading-snug"
            style={{ backgroundColor: bg, color: text }}
          >
            {issue}
          </span>
        );
      })}
    </div>
  );
}
