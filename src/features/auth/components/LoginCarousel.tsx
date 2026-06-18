import { useState, useEffect, useRef } from "react";
import loginBg from "@/assets/login-bg.png";

const carouselData = [
  {
    id: 1,
    image: loginBg,
    quote: '"Bacalah: Dengan nama Tuhanmu yang menciptakan..."',
    subtext: "Kelola santri dan pantau hafalan dengan lebih efisien."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1000",
    quote: '"Sebaik-baik kalian adalah yang belajar Al-Quran."',
    subtext: "Mencetak generasi rabbani dengan manajemen yang terstruktur."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=1000",
    quote: '"Hafalan yang terjaga adalah cahaya di dalam dada."',
    subtext: "Pantau progress halaqah di mana saja dan kapan saja."
  },
];

export function LoginCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Hitung slide berikutnya
      const nextSlide = (activeSlide + 1) % carouselData.length;
      
      if (carouselRef.current) {
        const { offsetWidth } = carouselRef.current;
        // Eksekusi scroll secara manual ke posisi pixel tertentu
        carouselRef.current.scrollTo({
          left: offsetWidth * nextSlide,
          behavior: "smooth",
        });
      }
      
      setActiveSlide(nextSlide);
    }, 3000); 

    return () => clearInterval(interval);
  }, [activeSlide]); 

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-dark">
      <div 
        ref={carouselRef}
        className="carousel h-full w-full overflow-x-hidden flex scroll-smooth pointer-events-none touch-none"
        style={{ 
          scrollSnapType: 'none', 
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none' 
        }}
      >
        {carouselData.map((item) => (
          <div 
            key={item.id} 
            className="carousel-item relative h-full w-full flex-shrink-0"
          >
            <img
              src={item.image}
              className="h-full w-full object-cover select-none"
              alt="Halaqah Illustration"
              draggable="false"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/95 via-background-dark/30 to-transparent" />

            <div className="absolute bottom-24 left-12 right-12 z-10">
              <h2 className="mb-4 text-3xl font-bold leading-tight text-white font-display">
                {item.quote}
              </h2>
              <p className="text-lg font-light text-gray-200">
                {item.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-12 z-20 flex gap-2">
        {carouselData.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 transition-all duration-700 rounded-full ${
              i === activeSlide ? 'w-10 bg-primary' : 'w-3 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}