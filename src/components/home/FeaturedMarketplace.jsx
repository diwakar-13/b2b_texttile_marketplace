import { OfferCarousel } from "../ui/Textile-corousal";

const featuredTextile = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=1966&auto=format&fit=crop",
    title: "Premium Organic Cotton",
    gsm: "220",
    price: "$2.45",
    moq: "1000",
    supplier: "CottonCo Textiles",
    rating: 4.8,
    reviewsCount: 120,
    badge: "Bestseller",
  },
  {
    id: 2,
    imageSrc: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1974&auto=format&fit=crop",
    title: "Washed Denim",
    gsm: "350",
    price: "$3.20",
    moq: "500",
    supplier: "Denim House",
    rating: 4.7,
    reviewsCount: 98,
    badge: null,
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1563212048-a006ee787e93?q=80&w=1998&auto=format&fit=crop",
    title: "Linen Premium 160s",
    gsm: "160",
    price: "$4.10",
    moq: "800",
    supplier: "Linen Lab",
    rating: 4.9,
    reviewsCount: 150,
    badge: null,
  },
  {
    id: 4,
    imageSrc: "https://images.unsplash.com/photo-1579899368560-6dd8cb92e205?q=80&w=2070&auto=format&fit=crop",
    title: "Pure Mulberry Silk",
    gsm: "96",
    price: "$8.90",
    moq: "300",
    supplier: "Silk Route",
    rating: 4.9,
    reviewsCount: 210,
    badge: null,
  },
];

export default function OfferCarouselDemo() {
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-7 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white tracking-tight">
          Featured in Marketplace
        </h2>
        <a
          href="#"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all products →
        </a>
      </div>

      <OfferCarousel offers={featuredTextile} />
    </div>
  );
}