'use client';

import React, { useState } from 'react';
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
  FiZap,
} from 'react-icons/fi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Sidebar from './SidebarProgram';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const programs = useSelector((state) => state.cartProgram.items);
  const products = useSelector((state) => state.cartProduct.items);
  const wishlist = useSelector((state) => state.wishList.items);

  const cartCount = programs.length + products.length;
  
  const wishlistCount = wishlist.length;

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'PROGRAMS', path: '/programs' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <FiZap size={26} className="text-green-500" />
              <span className="text-white text-xl font-black uppercase italic">
                SportAI
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8 font-bold">
              {links.map(({ name, path }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={name}
                    href={path}
                    className={`relative pb-1 transition-colors text-[15px] ${
                      isActive
                        ? 'text-green-500'
                        : 'text-[#dddd] hover:text-green-500'
                    }`}
                  >
                    {name}
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-green-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6">

              {/* Search */}
              <FiSearch className="nav-icon cursor-pointer" />

              {/* Wishlist */}
              <div className="relative cursor-pointer" onClick={() => router.push('/wishlist')}>
                <FiHeart className="nav-icon" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {/* Cart */}
              <div className="relative cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                <FiShoppingBag className="nav-icon" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* User */}
              <FiUser className="nav-icon cursor-pointer" onClick={()=>router.push('/admin/login')}/>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center gap-4">
              <FiSearch className="nav-icon cursor-pointer" />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <FiX size={26} className="text-green-500 cursor-pointer" />
                ) : (
                  <FiMenu size={26} className="cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10 font-bold">
                {links.map(({ name, path }) => {
                  const isActive = pathname === path;
                  return (
                    <Link
                      key={name}
                      href={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`transition-colors ${
                        isActive ? 'text-green-500' : 'hover:text-green-500'
                      }`}
                    >
                      {name}
                    </Link>
                  );
                })}

                <div className="flex gap-6 pt-4 border-t border-white/10">
                  {/* Wishlist */}
                  <div className="relative cursor-pointer" onClick={() => router.push('/wishlist')}>
                    <FiHeart className="nav-icon" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>

                  {/* Cart */}
                  <div className="relative cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                    <FiShoppingBag className="nav-icon" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>

                  <FiUser className="nav-icon cursor-pointer" onClick={()=>router.push('/admin/login')}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;
