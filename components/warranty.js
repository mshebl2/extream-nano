"use client";

import { Shield, Clock, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion"; // Import motion
import { useSiteImages } from "@/lib/useSiteImages";

export default function Warranty() {
  const { getImage } = useSiteImages({
    "warranty.image": "",
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

  const warrantyBackground = getImage("warranty.image");
  const sectionStyle = warrantyBackground
    ? {
        backgroundImage: `url(${warrantyBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <motion.section
      className="py-20 bg-gray-900 text-white"
      dir="rtl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      style={sectionStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#e9cb1d] mb-6">
            الضمان
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            نقدم لعملائنا أفضل منتجات على مستوى العالم ولقد اخترنا لعملائنا نخبة
            المنتجات العالمية
          </p>
        </motion.div>

        {/* Warranty Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* 10 Years Warranty */}
          <motion.div
            className="bg-[#7F3F97] p-8 rounded-3xl text-center"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-20 h-20 bg-[#e9cb1d] rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-3xl font-bold text-[#e9cb1d] mb-4">10 سنوات</h3>
            <p className="text-lg text-white">ضمان على أفلام الحماية</p>
          </motion.div>

          {/* Open Warranty */}
          <motion.div
            className="bg-[#7F3F97] p-8 rounded-3xl text-center"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-20 h-20 bg-[#e9cb1d] rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-3xl font-bold text-[#e9cb1d] mb-4">
              ضمان مفتوح
            </h3>
            <p className="text-lg text-white">على تظليل النوافذ</p>
          </motion.div>

          {/* Quality Assurance */}
          <motion.div
            className="bg-[#7F3F97] p-8 rounded-3xl text-center md:col-span-2 lg:col-span-1"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div className="w-20 h-20 bg-[#e9cb1d] rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-3xl font-bold text-[#e9cb1d] mb-4">
              جودة عالمية
            </h3>
            <p className="text-lg text-white">منتجات معتمدة دولياً</p>
          </motion.div>
        </div>

        {/* Features List */}
        <motion.div
          className="bg-[#7F3F97] rounded-3xl p-8 lg:p-12"
          variants={itemVariants}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-[#e9cb1d]">
            مميزات الضمان
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                {
                  title: "ضمان شامل",
                  description: "يغطي جميع العيوب في المواد والتصنيع",
                },
                {
                  title: "خدمة سريعة",
                  description: "استجابة فورية لجميع طلبات الضمان",
                },
                {
                  title: "فريق متخصص",
                  description: "خبراء مدربون على أعلى مستوى",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  variants={itemVariants}
                >
                  <div className="text-right flex-1">
                    <h4 className="text-xl font-semibold mb-2 text-[#e9cb1d] text-right">
                      {feature.title}
                    </h4>
                    <p className="text-white text-right">
                      {feature.description}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#e9cb1d] mt-1 flex-shrink-0" />
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "مواد أصلية",
                  description: "استخدام قطع غيار ومواد أصلية فقط",
                },
                {
                  title: "تغطية واسعة",
                  description: "خدمة في جميع أنحاء المملكة",
                },
                {
                  title: "دعم مستمر",
                  description: "متابعة دورية لحالة سيارتك",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  variants={itemVariants}
                >
                  <div className="text-right flex-1">
                    <h4 className="text-xl font-semibold mb-2 text-[#e9cb1d] text-right">
                      {feature.title}
                    </h4>
                    <p className="text-white text-right">
                      {feature.description}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#e9cb1d] mt-1 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
