'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { NewsItem } from '@/types';

interface NewsSliderProps {
  news: NewsItem[];
}

export default function NewsSlider({ news }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    resetTimeout();

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex: number) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, news.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex === 0 ? news.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-w-4xl mx-auto relative rounded-xl overflow-hidden shadow-lg">
      {/* Main Slide */}
      <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full">
        <Image
          src={news[currentIndex].imageUrl}
          alt={news[currentIndex].title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 896px"
          className="object-cover"
          priority
        />
        
        {/* Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end">
          <div className="p-4 md:p-6 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-2">{news[currentIndex].title}</h3>
            <p className="text-white/80 mb-3 line-clamp-2">{news[currentIndex].summary}</p>
            <Link 
              href={`/haberler/${news[currentIndex].slug}`}
              className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Devamını Oku
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors focus:outline-none"
        aria-label="Önceki Haber"
      >
        <FaChevronLeft size={18} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors focus:outline-none"
        aria-label="Sonraki Haber"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Haber ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 