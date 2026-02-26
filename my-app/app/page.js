'use client';

import React from 'react';
import Image from 'next/image';
import { ShopByCategoriesAndFeaturedProgram } from './components/Home/CategorieAndProgramSection';
import { ProgramsSection } from './components/Home/ProgramsCard';
import { useRouter } from 'next/navigation';
import { TrendingGear } from './components/Home/ProductsCard';

const Home = () => {
  const router = useRouter();
  return (
    <>
      <section className="relative bg-black text-white min-h-screen flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-transparent z-10"></div>
            <Image
              src="/fitness.jpg"
              alt="Runner"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-block mb-6">
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  New Collection 2026
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                UNLEASH YOUR{' '}
                <span className="text-green-500">POTENTIAL</span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-xl">
                AI-Driven Gear & Personalized Training Plans designed specifically for your peak performance metrics.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-black font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 uppercase tracking-wide"
                  onClick={()=>router.push('/shop')}  
                >
                  Shop Now
                </button>
                <button className="bg-transparent cursor-pointer border-2 border-white hover:bg-white hover:text-black text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 uppercase tracking-wide"
                  onClick={()=>router.push('/about')} 
                >
                  View Us
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent z-10"></div>
        </section>
        <TrendingGear/>

        <ShopByCategoriesAndFeaturedProgram/>

        <ProgramsSection/>

    </>

  );
};

export default Home;
