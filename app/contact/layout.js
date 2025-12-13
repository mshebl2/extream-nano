"use client";

import Header from "@/components/Header";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactLayout({ children }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error("Failed to fetch services for footer:", error);
      }
    }
    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* الهيدر */}
      <Header />

      {/* محتوى الصفحة */}
      <main className="min-h-screen">{children}</main>

      {/* الفوتر */}
      <motion.footer
        className="bg-gray-900 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand & Contact */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="flex items-center mb-6">
                <img src="/logo3.png" alt="XTREME NANO Logo" className="h-16 w-auto" />
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                نوفر لعملائنا تجربة فاخرة في عالم العناية بالسيارات، خبرة وجودة
                وتكنولوجيا متطورة في مكان واحد.
              </p>

              {/* Contact Icons */}
              <div className="flex gap-4 mb-6">
                <motion.a
                  href="tel:0570044578"
                  className="bg-[#7F3F97] p-3 rounded-full hover:opacity-90 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Phone className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://wa.me/966570044578"
                  className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  واتس اب
                </motion.a>
                <motion.a
                  href="mailto:info@extremenano.sa"
                  className="bg-[#e9cb1d] p-3 rounded-full hover:opacity-90 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-5 h-5 text-black" />
                </motion.a>
              </div>

              {/* Social Media Icons */}
              <div className="text-[#e9cb1d] font-semibold mb-4">تابعونا على:</div>
              <div className="flex gap-4 mb-6">
                <motion.a
                  href="https://www.tiktok.com/@xtremenano_sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black p-3 rounded-full hover:bg-gray-800 transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  TikTok
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/xtremenano_sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full hover:opacity-90 transition-all duration-300 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-5 h-5 text-white group-hover:text-[#e9cb1d]" />
                </motion.a>
              </div>
              <div className="space-y-1 text-gray-400 text-sm">
                <p>@XTREMENANO_SA</p>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-[#e9cb1d]">خدماتنا</h3>
              <ul className="space-y-3 text-gray-300">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service._id}>
                      <Link
                        href={`/services/${encodeURIComponent(service.slug)}`}
                        className="hover:text-[#e9cb1d] transition-colors"
                      >
                        {service.titleAr}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/services" className="hover:text-[#e9cb1d] transition-colors">
                        جميع الخدمات
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-[#e9cb1d]">تواصل معنا</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#7F3F97]" />
                  <a href="tel:570044578" className="hover:text-[#7F3F97] transition-colors">
                    +966 570044578
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#e9cb1d]" />
                  <a href="mailto:info@extremenano.sa" className="hover:text-[#e9cb1d] transition-colors">
                    Info@xtreme-nano.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#7F3F97]" />
                  <span>الرياض - حي الربيع - طريق الثمامة</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div className="mt-8 pt-8 text-center" variants={itemVariants}>
            <p className="text-gray-400">
              © 2025 <span className="text-[#e9cb1d]">XTREME NANO</span>. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 mt-2">
              تم التصميم بواسطة{" "}
              <a href="https://wa.me/966541430116" className="text-[#e9cb1d] ml-1" target="_blank" rel="noopener noreferrer">
                رواد الرقمية
              </a>
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
