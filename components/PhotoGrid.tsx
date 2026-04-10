/**
 * PhotoGrid — full-width 4-column grid matching Figma frames 1:89–1:92.
 * Uses the original plant photos extracted directly from the Figma design.
 */

const photos = [
  { src: "/images/plant1.png", alt: "Haworthia succulent in a wooden pot" },
  { src: "/images/plant2.png", alt: "Pothos vine on a wall" },
  { src: "/images/plant3.png", alt: "Monstera in a grey pot" },
  { src: "/images/plant4.png", alt: "Flowering plant outdoors" },
];

export default function PhotoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full">
      {photos.map((photo, i) => (
        <div key={i} className="aspect-square overflow-hidden bg-[#4c7a44]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
