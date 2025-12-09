"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Shield,
  Award,
  Phone,
  MessageCircle,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteImages } from "@/lib/useSiteImages";

export default function Hero() {
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const { getImage } = useSiteImages({
    "hero.background": "/hero.svg",
  });
  const heroBackground = getImage("hero.background", "/hero.svg");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="home"
      className="relative bg-white text-black overflow-hidden min-h-screen"
      dir="rtl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-10"
        variants={imageVariants}
      >
        <img
          src={heroBackground}
          alt="XTREME NANO X Background"
          className="w-full h-full object-contain max-w-6xl"
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Right Content (النص) */}
          <div className="text-center lg:text-right 
                          order-2 lg:order-1">
            <motion.p
              className="text-xl lg:text-2xl mb-8 text-black leading-relaxed"
              variants={itemVariants}
            >
              نوفر لعملائنا تجربة فاخرة في عالم العناية بالسيارات
              <br />
              خبرة وجودة وتكنولوجيا متطورة في مكان واحد
            </motion.p>

            {/* Features */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 bg-[#7F3F97] text-white rounded-full px-4 py-2 shadow-lg">
                <Star className="w-4 h-4 text-[#e9cb1d]" />
                <span className="text-sm font-semibold">جودة عالمية</span>
              </div>
              <div className="flex items-center gap-2 bg-[#7F3F97] text-white rounded-full px-4 py-2 shadow-lg">
                <Shield className="w-4 h-4 text-[#e9cb1d]" />
                <span className="text-sm font-semibold">ضمان 10 سنوات</span>
              </div>
              <div className="flex items-center gap-2 bg-[#7F3F97] text-white rounded-full px-4 py-2 shadow-lg">
                <Award className="w-4 h-4 text-[#e9cb1d]" />
                <span className="text-sm font-semibold">خبراء معتمدون</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative mb-6"
              variants={itemVariants}
            >
              <motion.a
                href="/services"
                className="bg-[#e9cb1d] text-black px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                استكشف خدماتنا
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </motion.a>

              <div className="relative">
                <motion.button
                  onClick={() =>
                    setShowBookingOptions(!showBookingOptions)
                  }
                  className="border-2 border-[#7F3F97] text-white px-8 py-4 rounded-full font-bold text-lg bg-[#7F3F97] hover:opacity-90 transition-all duration-300 w-full shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  احجز موعد
                </motion.button>

                {showBookingOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200"
                  >
                    <a
                      href="tel:0570044578"
                      className="flex items-center gap-2 px-4 py-3 text-black hover:bg-gray-100 transition-colors"
                      onClick={() => setShowBookingOptions(false)}
                    >
                      <Phone className="w-5 h-5 text-[#7F3F97]" />
                      اتصال
                    </a>
                    <a
                      href="#contact"
                      className="flex items-center gap-2 px-4 py-3 text-black hover:bg-gray-100 transition-colors"
                      onClick={() => setShowBookingOptions(false)}
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      واتساب
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Free Service */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3 text-black"
              variants={itemVariants}
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">
                راحتك تهمنا … سطحتك مجانية استلام وتسليم
              </span>
            </motion.div>
          </div>

          {/* Left Content (صورة أو عنصر آخر) */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <img
              src={heroBackground}
              alt="XTREME NANO Background"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
