import { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-[#3d6636] rounded-[20px] overflow-hidden flex flex-col border border-white/5 hover:border-white/15 transition-all hover:-translate-y-0.5 duration-200">
      {/* Product image */}
      <div className="h-[180px] bg-[#2e5029] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback: green placeholder
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.parentElement!.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-[#2e5029]">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 6C14 6 6 14 6 24C6 32 11 39 24 43C37 39 42 32 42 24C42 14 34 6 24 6Z" fill="#4c7a44"/>
                  <path d="M24 42V20" stroke="#d0ff93" stroke-width="2" stroke-linecap="round"/>
                  <path d="M24 28L18 23" stroke="#d0ff93" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M24 32L30 27" stroke="#d0ff93" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
            `;
          }}
        />
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-dm font-medium text-white text-[15px] leading-snug">
          {product.name}
        </h3>
        <p className="font-dm font-light text-white/65 text-[13px] leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
          <span className="font-dm font-bold text-[#d0ff93] text-[18px]">
            {product.price}
          </span>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-1.5
              bg-[#ff9900] hover:bg-[#e08a00] active:bg-[#c97900]
              text-white font-dm font-medium text-[13px]
              px-4 py-2 rounded-full transition-colors whitespace-nowrap
            `}
            aria-label={`Buy ${product.name} on Amazon`}
          >
            <AmazonIcon />
            amazon.in
          </a>
        </div>
      </div>
    </div>
  );
}

function AmazonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M13.23 10.56v-.45c-.96.1-1.95.21-2.78.57-.83.35-1.39 1.01-1.39 2.02 0 1.26.82 1.89 1.86 1.89.87 0 1.64-.38 2.31-1.03zM3.67 19.35c3.85 2.68 9.01 4.28 14.27 3.11 3.28-.72 6.28-2.47 8.16-5.11.23-.32-.03-.74-.41-.6-3.73 1.37-7.63 2.04-11.38 2.04-3.3 0-6.65-.56-9.88-1.76-.44-.17-.81.3-.76.32z"/>
      <path d="M21.17 17.2c-.27-.35-.8-.52-1.35-.47l-.01-.01c-1.53.12-2.67.1-3.6-.08-1.06-.22-1.8-.67-2.42-1.29v-5.5c0-.74-.57-1.34-1.29-1.34h-.36c-.72 0-1.29.6-1.29 1.34v5.5c-.62.62-1.36 1.07-2.42 1.29-.93.18-2.07.2-3.6.08l-.01.01c-.55-.05-1.08.12-1.35.47-.26.34-.26.78.04 1.18 1.46 1.97 3.62 3.31 6.02 3.79 2.4.48 4.89.15 7.01-.96 2.12-1.11 3.77-2.94 4.59-5.1.14-.36.01-.77-.96-1.91z" opacity=".5"/>
    </svg>
  );
}
