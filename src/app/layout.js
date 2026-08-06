import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Textil.",
  description: "AI Powered B2B Textile Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFBFD] text-neutral-950 font-sans">
        <MarketplaceProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" richColors />
          </CartProvider>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
