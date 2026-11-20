import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

export default function MainSlider() {
  const slides = [
    {
      title: 'Fresh Vegetables & Organic Fruits',
      subtitle: 'Get up to 30% off on your first order this week!',
      badge: 'Limited Time Offer',
      bgClass: 'from-emerald-900/80 via-emerald-800/60 to-transparent',
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      link: '/products',
    },
    {
      title: 'Freshly Baked Artisan Breads & Pastries',
      subtitle: 'Delivered warm and crispy to your doorstep every morning.',
      badge: 'Bakery Special',
      bgClass: 'from-amber-950/80 via-amber-900/60 to-transparent',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      link: '/products',
    },
    {
      title: 'Top Brand Electronics & Daily Essentials',
      subtitle: 'Premium brands, verified genuine products with best warranty.',
      badge: 'Best Deals',
      bgClass: 'from-blue-950/80 via-blue-900/60 to-transparent',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      link: '/products',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-6">
      {/* Main Swiper Slider - 2 cols on desktop */}
      <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-sm relative h-[360px] sm:h-[420px]">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgClass} flex flex-col justify-center px-8 sm:px-12 text-white`}>
                <div className="inline-flex items-center gap-1.5 bg-[#0aad0a] text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slide.badge}
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold max-w-md leading-tight mb-3 text-white">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-200 max-w-sm mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088a08] text-white font-medium text-sm px-6 py-3 rounded-xl transition-all w-fit shadow-md hover:gap-3"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Side Static Promo Banners */}
      <div className="hidden lg:flex flex-col gap-4 h-[420px]">
        <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xs group">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
            alt="Healthy Veggies"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              Natural Taste
            </span>
            <h3 className="text-lg font-bold leading-tight mb-2">
              Everyday Fresh Grocery
            </h3>
            <Link
              to="/products"
              className="text-xs font-semibold text-emerald-400 hover:text-white flex items-center gap-1"
            >
              Explore Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xs group">
          <img
            src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80"
            alt="Snacks and juices"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Exclusive 20% Off
            </span>
            <h3 className="text-lg font-bold leading-tight mb-2">
              Breakfast & Organic Milks
            </h3>
            <Link
              to="/products"
              className="text-xs font-semibold text-amber-400 hover:text-white flex items-center gap-1"
            >
              Order Online <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
