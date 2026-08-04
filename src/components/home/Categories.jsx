import Link from "next/link";
import Carousel, { Card } from "../ui/CarouselDemo";

const textilCategories = [
  {
    src: "/cat_cotton.png",
    title: "Cotton Fabrics",
    categorySlug: "Cotton",
    category: "2,450+ products",
    content: (
      <p className="text-neutral-500">
        Premium long-staple organic cotton, combed cotton, and raw slub varieties.
      </p>
    ),
  },
  {
    src: "/cat_linen.png",
    title: "Linen Fabrics",
    categorySlug: "Linen",
    category: "1,240+ products",
    content: (
      <p className="text-neutral-500">
        Pure European flax linen blends, pre-washed textures, and high GSM collections.
      </p>
    ),
  },
  {
    src: "/cat_silk.png",
    title: "Silk Fabrics",
    categorySlug: "Silk",
    category: "980+ products",
    content: (
      <p className="text-neutral-500">
        Pure Mulberry silk, charmeuse, satin weave, and raw Tussar silk for luxury couture.
      </p>
    ),
  },
  {
    src: "/cat_denim.png",
    title: "Denim Fabrics",
    categorySlug: "Denim",
    category: "1,760+ products",
    content: (
      <p className="text-neutral-500">
        Heavyweight selvage denim, recycled stretch denim, and indigo wash options.
      </p>
    ),
  },
  {
    src: "/cat_wool.png",
    title: "Wool Fabrics",
    categorySlug: "Wool",
    category: "1,170+ products",
    content: (
      <p className="text-neutral-500">
        Merino wool blends, cashmere, houndstooth suitings, and brushed outerwear.
      </p>
    ),
  },
  {
    src: "/cat_sustainable.png",
    title: "Sustainable Fabrics",
    categorySlug: "Sustainable",
    category: "1,580+ products",
    content: (
      <p className="text-neutral-500">
        GOTS-certified organic fabrics, hemp weaves, and recycled blends.
      </p>
    ),
  },
];

export default function LinearCarouselDemo() {
  const cards = textilCategories.map((card, index) => (
    <Link key={card.src} href={`/marketplace?category=${card.categorySlug}`}>
      <Card card={card} index={index} />
    </Link>
  ));

  return (
    <div className="w-full h-full">
      <h1 className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white tracking-tight px-4 sm:px-6 md:px-7">
        Premium Categories
      </h1>
      <Carousel items={cards} />
    </div>
  );
}