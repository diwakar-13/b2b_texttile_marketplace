"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
  autoplay = false,
  autoplaySpeed = 0.5,
}) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoplay || isHovered) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const scroll = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += autoplaySpeed;

        const scrollWidth = carouselRef.current.scrollWidth;

        if (carouselRef.current.scrollLeft >= scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }

        checkScrollability();
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoplay, autoplaySpeed, isHovered]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = isMobile() ? 240 : 330;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = isMobile() ? 240 : 330;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 320; // (md:w-80)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  };

  // Drag to scroll logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeftState(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeftState - walk;
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div
        className="relative w-full mx-auto px-4 md:px-8"
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* LEFT FLOATING ARROW */}
        <button
          type="button"
          className="absolute -left-3 md:left-1 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-md"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        </button>

        {/* RIGHT FLOATING ARROW */}
        <button
          type="button"
          className="absolute -right-3 md:right-1 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border hover:bg-muted disabled:opacity-30 transition-all shadow-md"
          onClick={scrollRight}
          disabled={!canScrollRight}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </button>

        <div
          className={cn(
            "flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-5 md:py-10 cursor-grab active:cursor-grabbing",
            isDragging && "cursor-grabbing scroll-auto",
          )}
          ref={carouselRef}
          onScroll={checkScrollability}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className={cn(
              "absolute right-0 z-1000 h-auto w-[5%] overflow-hidden bg-gradient-to-l from-white dark:from-background to-transparent pointer-events-none",
            )}
          ></div>

          <div className={cn("flex flex-row justify-start gap-4")}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: "easeOut",
                }}
                key={"card-" + index}
                className="rounded-3xl shrink-0"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }) => {
  return (
    <motion.button
      layoutId={layout ? `card-${card.title}-${index}` : undefined}
      className="relative z-10 flex h-52 w-56 flex-col items-start justify-end overflow-hidden rounded-3xl bg-gray-100 md:h-82 md:w-80 dark:bg-neutral-900"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-40 p-8 w-full">
        {card.category && (
          <motion.p
            layoutId={layout ? `category-${card.category}-${index}` : undefined}
            className="text-left font-mono text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
        )}
        <motion.p
          layoutId={layout ? `title-${card.title}-${index}` : undefined}
          className="mt-2 max-w-xs text-left font-mono text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
        >
          {card.title}
        </motion.p>
      </div>
      <img
        src={card.src}
        alt={card.title}
        className="absolute inset-0 z-10 w-full h-full object-cover"
      />
    </motion.button>
  );
};

export const BlurImage = ({ height, width, src, className, alt, ...rest }) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

export default Carousel;
