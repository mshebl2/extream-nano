"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔥 ترتيب الديسكتوب الأصلي زي ما كان
  const desktopLinks = [
    { href: "/contact", label: "اتصل بنا" },
    { href: "/blog", label: "المدونة" },
    { href: "/services", label: "خدماتنا" },
    { href: "/about", label: "من نحن" },
    { href: "/#home", label: "الرئيسية" },
  ];

  // 🔥 ترتيب الموبايل الجديد اللي انت طلبته:
  const mobileLinks = [
    { href: "/#home", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "خدماتنا" },
    { href: "/blog", label: "المدونة" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.jpg" alt="XTREME NANO Logo" className="h-12 w-auto" />
          </div>

          {/* ================= DESKTOP MENU ================= */}
          <nav className="hidden md:flex items-center gap-8">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-black hover:text-[#7F3F97] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="tel:570044578"
              className="bg-[#7F3F97] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              +966 570044578
            </a>
          </nav>

          {/* ================ MOBILE MENU BUTTON ================ */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-black hover:text-[#7F3F97]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ================ MOBILE MENU ================ */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-4 text-right">

                {/* روابط الموبايل بالترتيب الجديد */}
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-black hover:text-[#7F3F97] font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* زر الاتصال في النهاية */}
                <a
                  href="tel:570044578"
                  className="bg-[#7F3F97] text-white px-6 py-2 rounded-full font-semibold text-center flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="w-4 h-4" />
                  +966 570044578
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
