/**
 * Footer — two-column layout
 * Left: made with love credit | Right: copyright
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="font-dm font-normal text-[14px] md:text-[16px] text-white/70 text-center md:text-left">
        Made with love by Ahilapillai (and a few plants sacrificed along the way 🥲)
      </p>
      <p className="font-dm font-normal text-[14px] md:text-[16px] text-white/70 text-center md:text-right">
        © {year} LeafLens&nbsp;|&nbsp;All rights reserved
      </p>
    </footer>
  );
}
