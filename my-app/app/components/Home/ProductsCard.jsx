'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiHeart, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { fetchProducts } from '@/app/lib/Redux/productSlice';
import { addToCartProduct } from '@/app/lib/Redux/cartProductSlice';
import { toggleWishlist } from '@/app/lib/Redux/wishListSlice';
import { useRouter } from 'next/navigation';

/* =========================
   TRENDING GEAR COMPONENT
========================= */
export const TrendingGear = () => {
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <h2 className="pb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Trending Gear
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

/* =========================
   PRODUCT CARD COMPONENT
========================= */
const ProductCard = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishList.items);

  // Check if product is in wishlist
  const inWishlist = wishlist.some((item) => item.id === product.id);

  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;
  
  return (
    <div className="w-75 group flex flex-col gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 relative">
      
      {/* IMAGE & OVERLAY */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-800 shadow-md">
        
        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 left-3 z-20 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            -{discountPercent}% Sale
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={() => dispatch(toggleWishlist(product))}
          className="absolute cursor-pointer top-3 right-3 z-30 flex items-center justify-center rounded-full p-1.5 backdrop-blur-sm transition-colors duration-300 bg-black/40"
        >
          {inWishlist ? (
            <FaHeart className="w-5 h-5 text-red-600 transition-transform duration-200 scale-110" />
          ) : (
            <FiHeart className="w-5 h-5 text-white group-hover:text-green-400 transition-transform duration-200" />
          )}
        </button>

        {/* Product Image */}
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors duration-300 z-10 rounded-xl" />

        {/* Centered View Icon */}
        <button className="cursor-pointer absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={()=>router.push(`shop/${product.id}`)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 transition-colors">
            <FiEye className="w-6 h-6 text-green-400" />
          </div>
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{product.category}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-400">{Number(product.price).toFixed(2)}</span>

          {/* Add to Cart Button */}
          <button
            onClick={() => dispatch(addToCartProduct(product))}
            className="cursor-pointer text-slate-500 dark:text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase"
          >
            Add <FiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   MAIN APP WRAPPER
========================= */
export default function App() {
  return (
    <div className="min-h-screen bg-[#050b07] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <TrendingGear />
      </div>
    </div>
  );
}
