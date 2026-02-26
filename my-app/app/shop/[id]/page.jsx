"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProducts } from "@/app/lib/Redux/productSlice";
import { addToCartProduct } from "@/app/lib/Redux/cartProductSlice";
import { toggleWishlist } from "@/app/lib/Redux/wishListSlice";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus
} from "react-icons/fi";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const products = useSelector((state) => state.products.items || []);
  const loading = useSelector((state) => state.products.loading);
  const wishlist = useSelector((state) => state.wishList.items);

  const product = products.find((p) => String(p.id) === String(id));
  const liked = wishlist.some((i) => i.id === product?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b07] flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050b07] flex items-center justify-center text-white">
        Product not found
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.image];

  return (
    <div className="min-h-screen bg-[#050b07] p-8">
      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white mb-6"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT – IMAGES */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#102216] mb-4">
              <div
                className="w-full aspect-4/3 bg-cover bg-center hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${images[activeImage]})` }}
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-16 rounded-lg bg-cover bg-center border
                    ${
                      activeImage === index
                        ? "border-[#13ec5b]"
                        : "border-white/10"
                    }
                  `}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT – DETAILS */}
          <div className="flex flex-col gap-6">

            {/* TITLE + WISHLIST */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-black text-white">
                {product.name}
              </h1>

              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className={`p-2 rounded-full transition
                  ${
                    liked
                      ? "bg-white text-red-600"
                      : "bg-black/40 text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                <FiHeart />
              </button>
            </div>

            {/* PRICE + STOCK */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#13ec5b]">
                ${product.price}
              </span>

              <span className="text-xs px-3 py-1 rounded-full bg-[#13ec5b]/20 text-[#13ec5b]">
                In Stock
              </span>
            </div>

            {/* AI ANALYSIS */}
            <div className="bg-white/5 rounded-lg p-4 border-l-2 border-[#13ec5b]/60">
              <span className="text-xs font-bold text-[#13ec5b] uppercase">
                AI Analysis
              </span>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* AI HIGHLIGHTS */}
            {product.aiHighlights && (
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                {product.aiHighlights.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#13ec5b] rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Quantity</span>

              <div className="flex items-center bg-white/5 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 text-white"
                >
                  <FiMinus />
                </button>
                <span className="px-4 text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-2 text-white"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={() =>
                dispatch(addToCartProduct({ ...product, quantity: qty }))
              }
              className="flex items-center justify-center gap-2 py-4 bg-white text-[#102216] font-black uppercase rounded-lg hover:bg-[#13ec5b] transition"
            >
              <FiShoppingCart />
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
