import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef } from "react";
import img1 from "@/assets/carousel/img1.webp";
import img2 from "@/assets/carousel/img2.webp";
import img3 from "@/assets/carousel/img3.webp";
import Autoplay from "embla-carousel-autoplay";

function CarouselSlider() {
  const carouselRef = useRef(null);

  const slides = [
    {
      title: "Modern Living Spaces",
      description: "Discover contemporary homes designed for modern lifestyles",
      imageUrl: img1,
    },
    {
      title: "Luxury Properties",
      description: "Experience the finest in luxury real estate",
      imageUrl: img2,
    },
    {
      title: "Smart Homes",
      description: "Step into the future with our smart home technology",
      imageUrl: img3,
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div ref={carouselRef}>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                {/* Image Container */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-md">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24">
                  <div className="max-w-xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 text-center">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div className="hidden sm:block">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext
            className="absolute right-4 top-1/2 -translate-y-1/2"
            data-carousel-next
          />
        </div>
      </Carousel>
    </div>
  );
}

export default CarouselSlider;
