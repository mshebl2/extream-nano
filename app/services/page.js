"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header"; // <- تأكد من وجود هذا الملف
import { useSiteImages } from "@/lib/useSiteImages";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getImage } = useSiteImages({
    "services.background": "/hero.svg",
  });

  useEffect(() => {
    let active = true;

    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) return;

        const data = await res.json();
        if (active && Array.isArray(data)) {
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchServices();
    return () => {
      active = false;
    };
  }, []);

  const serviceCards = useMemo(() => {
    return services.map((service) => {
      const imageUrl = service.imageFileId
        ? `/api/images/${service.imageFileId}`
        : service.image || "/hero.png";

      return (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
        >
          <img
            src={imageUrl}
            alt={service.titleAr || service.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-[#7F3F97] mb-2">
              {service.titleAr || service.title}
            </h2>
            <p className="text-gray-700">
              {service.descriptionAr || service.description}
            </p>
          </div>
        </Link>
      );
    });
  }, [services]);

  const backgroundImage = getImage("services.background", "/hero.svg");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header className="text-center py-12 bg-white shadow-md">
        <div
          className="rounded-2xl bg-cover bg-center bg-no-repeat p-8"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <h1 className="text-4xl font-bold text-[#7F3F97] mb-4">خدماتنا</h1>
          <p className="text-gray-700 text-lg max-w-xl mx-auto">
            نقدم أفضل خدمات العناية بالسيارات في الرياض باستخدام مواد وتقنيات عالية الجودة.
          </p>
        </div>
      </Header>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-600">جاري تحميل الخدمات...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-600">لا توجد خدمات متاحة حالياً</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{serviceCards}</div>
        )}
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
