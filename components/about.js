"use client";

import { Target, Eye, Heart, DollarSign } from "lucide-react";
import { motion } from "framer-motion"; // Import motion
import { useSiteImages } from "@/lib/useSiteImages";

export default function About() {
  const { getImage } = useSiteImages({
    "about.image": "/aboutus.png",
  });

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="about"
      className="py-20 bg-gray-50"
      dir="rtl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#e9cb1d] mb-6">
            من نحن
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            في اكستريم نانو تأتي الجودة في المقام الأول ونلتزم دائماً بتقديم
            أعلى المعايير في خدمات العناية بسيارتك
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content - Right Side for RTL */}
          <motion.div className="text-right" variants={itemVariants}>
            <h3 className="text-3xl font-bold text-black mb-6 text-right">
              <span className="text-[#e9cb1d]">XTREME NANO</span>
            </h3>
            <p className="text-lg text-black mb-6 leading-relaxed text-right">
              نوفر لعملائنا تجربة فاخرة في عالم العناية بالسيارات، خبرة وجودة
              وتكنولوجيا متطورة في مكان واحد، نهتم بأدق التفاصيل لنمنح سيارتك
              الحماية المثالية والمظهر الأنيق.
            </p>
            <p className="text-lg text-black leading-relaxed text-right">
              نخدم الأفراد الباحثين عن التميز ونفخر بأن نكون خيارك الأول دائماً.
              بفضل خبرتنا والمتخصصين المدربين على أعلى مستوى.
            </p>
          </motion.div>

          {/* Image - Left Side for RTL */}
          <motion.div className="relative" variants={imageVariants}>
            <img
              src={getImage("about.image", "/aboutus.png")}
              alt="Professional Car Care"
              className="w-full h-80 object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Goal */}
          <motion.div
            className="bg-[#7F3F97] text-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-16 h-16 bg-[#e9cb1d] rounded-2xl flex items-center justify-center mb-6 ml-auto">
              <Target className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-xl font-bold text-[#e9cb1d] mb-4 text-right">
              هدفنا
            </h4>
            <p className="text-white leading-relaxed text-right">
              الوصول إلى المركز الأول في المملكة العربية السعودية في مجال
              العناية بالسيارات
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="bg-[#7F3F97] text-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-16 h-16 bg-[#e9cb1d] rounded-2xl flex items-center justify-center mb-6 ml-auto">
              <Eye className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-xl font-bold text-[#e9cb1d] mb-4 text-right">
              طموحنا
            </h4>
            <p className="text-white leading-relaxed text-right">
              نطمح لتحقيق الرضا التام لعملائنا من خلال تقديم أفضل الخدمات وبأعلى
              جودة
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            className="bg-[#7F3F97] text-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-16 h-16 bg-[#e9cb1d] rounded-2xl flex items-center justify-center mb-6 ml-auto">
              <Heart className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-xl font-bold text-[#e9cb1d] mb-4 text-right">
              رسالتنا
            </h4>
            <p className="text-white leading-relaxed text-right">
              نسعى لتحقيق التميز في تقديم خدمات ملائمة لعملائنا من حيث الجودة
              والأداء ومستوى التعامل
            </p>
          </motion.div>

          {/* Pricing */}
          <motion.div
            className="bg-[#7F3F97] text-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-16 h-16 bg-[#e9cb1d] rounded-2xl flex items-center justify-center mb-6 ml-auto">
              <DollarSign className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-xl font-bold text-[#e9cb1d] mb-4 text-right">
              أسعارنا الأفضل
            </h4>
            <p className="text-white leading-relaxed text-right">
              نسعى دائماً لتقديم أفضل سعر ممكن لعملائنا مع كامل المزايا والخدمات
              الممكنة
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
