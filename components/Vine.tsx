/**
 * Vine — static fixed decorative element on the right edge of the viewport.
 * No scroll logic, no transforms, no animation.
 */
export default function Vine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none fixed top-0 right-0 h-screen overflow-hidden z-0 hidden md:block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-bg-img.png"
        alt=""
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
