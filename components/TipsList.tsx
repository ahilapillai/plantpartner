/**
 * TipsList — bullet list of care tips with lime accent dots
 */

interface Props {
  tips: string[];
}

export default function TipsList({ tips }: Props) {
  if (!tips.length) return null;

  return (
    <ul className="flex flex-col gap-3" role="list" aria-label="Care tips">
      {tips.map((tip, i) => (
        <li key={i} className="flex items-start gap-3">
          {/* Accent bullet */}
          <span
            className="mt-[7px] w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#d0ff93" }}
            aria-hidden="true"
          />
          <span className="font-dm font-light text-[15px] md:text-[16px] text-white/90 leading-relaxed">
            {tip}
          </span>
        </li>
      ))}
    </ul>
  );
}
