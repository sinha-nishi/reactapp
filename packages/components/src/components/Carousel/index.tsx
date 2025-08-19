import React, { useRef, useEffect } from "react";
import "./carousel.css";

export type CarouselProps = {
  items: { src: string; label?: string }[];
  layout?: "multi-browse" | "uncontained" | "hero" | "full-screen";
  align?: "start" | "center";
  autoScroll?: boolean;
  interval?: number; // ms
};

const Carousel: React.FC<CarouselProps> = ({
  items,
  layout = "multi-browse",
  align = "center",
  autoScroll = true,
  interval = 3000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const el = containerRef.current;
    const timer = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [autoScroll, interval]);

  return (
    <div className={`carousel carousel--${layout} carousel--${align}`}>
      <div className="carousel__container" ref={containerRef}>
        {items.map((item, idx) => (
          <div key={idx} className="carousel__item">
            <img src={item.src} alt={item.label || `item-${idx}`} />
            {item.label && <div className="carousel__label">{item.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
