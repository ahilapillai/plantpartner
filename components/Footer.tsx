/**
 * Footer — matches Figma node 1:108
 * Centered copyright text, DM Sans Regular 20px, white/90
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center px-4 py-10">
      <p className="font-dm font-normal text-[16px] md:text-[20px] text-white/90">
        © {year} LeafLens&nbsp;|&nbsp;All rights reserved
      </p>
    </footer>
  );
}
