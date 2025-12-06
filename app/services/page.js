"use client";

import Link from "next/link";
import Header from "@/components/Header"; // <- تأكد من وجود هذا الملف

export default function ServicesPage() {
  const services = [
    {
      name: "فيلم حماية الطلاء (PPF)",
      slug: "ppf",
      image: "pff.png",
      description:
        "احمِ سيارتك من الخدوش والصدمات وبقع الحشرات والطقس القاسي باستخدام فيلم حماية الطلاء عالي الجودة في الرياض.",
    },
    {
      name: "تظليل النوافذ",
      slug: "tint",
      image: "/tzlel.png",
      description:
        "استمتع بحماية مثالية من الأشعة فوق البنفسجية والحرارة الزائدة مع تظليل النوافذ المتطور لسيارتك في الرياض.",
    },
    {
      name: "النانو سيراميك خارجي",
      slug: "nano-exterior",
      image: "/tlme3.png",
      description:
        "عزز لمعان ومتانة سيارتك على المدى الطويل مع طلاء النانو سيراميك الخارجي المتطور في الرياض.",
    },
    {
      name: "النانو سيراميك داخلي",
      slug: "nano-interior",
      image: "/nano.png",
      description:
        "حافظ على نظافة ولمعان داخلية السيارة مع النانو سيراميك الداخلي المتخصص لجميع الأسطح في الرياض.",
    },
    {
      name: "تلميع داخلي وخارجي",
      slug: "polishing",
      image: "/tlme33.png",
      description:
        "أعد سيارتك كالجديدة مع خدمة التلميع الداخلي والخارجي التي تمنح لمعاناً استثنائياً يدوم طويلاً في الرياض.",
    },
    {
      name: "خدمات مميزة للسيارة",
      slug: "premium",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description:
        "استمتع بأقصى درجات العناية لسيارتك مع خدمات تنظيف وحماية شاملة وفريدة من نوعها في الرياض.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header className="text-center py-12 bg-white shadow-md">
        <h1 className="text-4xl font-bold text-[#7F3F97] mb-4">خدماتنا</h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          نقدم أفضل خدمات العناية بالسيارات في الرياض باستخدام مواد وتقنيات عالية الجودة.
        </p>
      </Header>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-[#7F3F97] mb-2">{service.name}</h2>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-[#7F3F97] text-center text-white">
        <h2 className="text-3xl font-bold text-[#e9cb1d] mb-4">جاهز لتجربة الأفضل؟</h2>
        <p className="mb-6 text-lg">
          احجز موعدك الآن واستمتع بخدمة ممتازة لسيارتك في الرياض
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:0570044578"
            className="bg-[#e9cb1d] text-black px-8 py-3 rounded-full font-bold text-lg hover:opacity-90 transition-all"
          >
            اتصال
          </a>
          <a
            href="https://wa.me/966570044578"
            className="border-2 border-[#e9cb1d] text-[#e9cb1d] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#e9cb1d] hover:text-black transition-all"
          >
            واتس اب
          </a>
        </div>
      </section>
    </div>
  );
}
