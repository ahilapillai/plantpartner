import { IconHeartbeat, IconBulb, IconShoppingBag } from "@tabler/icons-react";

/**
 * FeatureIcons — 3 feature pills from Figma Frame 7 (y=615)
 * Icons sourced from tabler.io
 */

const features = [
  {
    bg: "#ffeb93",
    iconColor: "#4c7a44",
    Icon: IconHeartbeat,
    label: "Know your plant's\nhealth score",
  },
  {
    bg: "#e8ff93",
    iconColor: "#4c7a44",
    Icon: IconBulb,
    label: "Expert tips and\npersonalised advice",
  },
  {
    bg: "#eecdbd",
    iconColor: "#5e5040",
    Icon: IconShoppingBag,
    label: "Curated plant products\nas per your need",
  },
] as const;

export default function FeatureIcons() {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 items-start md:items-center justify-center w-full max-w-[1274px] px-4">
      {features.map(({ bg, iconColor, Icon, label }, i) => (
        <div key={i} className="flex items-center gap-5 md:gap-6 flex-shrink-0">
          {/* Circular icon badge */}
          <div
            className="w-[101px] h-[101px] rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bg }}
          >
            <Icon size={48} stroke={1.5} color={iconColor} />
          </div>

          {/* Label */}
          <p className="font-dm font-light text-[22px] md:text-[25px] text-white/90 leading-snug whitespace-pre-line max-w-[220px]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
