import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { unstable_cache } from 'next/cache';
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 14400; // 4 hours

// Cached service fetching
const getServiceBySlug = unstable_cache(
  async (slug) => {
    await connectDB();
    const service = await Service.findOne({ slug }).lean();
    if (!service) return null;

    return {
      ...service,
      _id: service._id.toString(),
      image: service.imageFileId ? `/api/images/${service.imageFileId}` : service.image,
    };
  },
  ['service-detail'],
  { revalidate: 14400, tags: ['services'] }
);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'الخدمة غير موجودة' };
  }

  return {
    title: `${service.titleAr || service.title} | XTREME NANO`,
    description: service.descriptionAr || service.description,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 p-8">
        {/* زر العودة للخدمات */}
        <div className="mb-6 text-left max-w-7xl mx-auto">
          <Link
            href="/#services"
            className="text-[#7F3F97] font-bold underline"
          >
            ← العودة لصفحة الخدمات
          </Link>
        </div>

        {/* العنوان */}
        <h1 className="text-4xl font-bold text-[#7F3F97] mb-6 text-center">
          {service.titleAr || service.title}
        </h1>

        {/* وصف الخدمة */}
        <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-12 text-center">
          {service.descriptionAr || service.description}
        </p>

        {/* صورة الخدمة */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src={service.image}
              alt={service.titleAr || service.title}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* تفاصيل إضافية */}
        <section className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-[#7F3F97] mb-4 text-right">تفاصيل الخدمة</h2>
          <p className="text-gray-700 text-lg text-right">
            {service.longDescriptionAr || service.longDescription || service.descriptionAr || service.description}
          </p>

          {service.features && service.features.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-[#e9cb1d] mb-4 text-right">المميزات</h3>
              <ul className="list-disc list-inside text-right text-gray-700 space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {service.warranty && (
            <div className="mt-6 p-4 bg-[#7F3F97] bg-opacity-10 rounded-xl">
              <h3 className="text-xl font-bold text-[#7F3F97] mb-2 text-right">الضمان</h3>
              <p className="text-gray-700 text-right">{service.warranty}</p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-[#7F3F97] text-center text-white rounded-3xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#e9cb1d] mb-4">جاهز لتجربة الأفضل؟</h2>
          <p className="mb-6 text-lg">
            احجز موعدك الآن واستمتع بخدمة ممتازة لسيارتك في الرياض
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:0570044578"
              className="bg-[#e9cb1d] text-black px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
            >
              اتصال
            </a>
            <a
              href="https://wa.me/966570044578"
              className="border-2 border-[#e9cb1d] text-[#e9cb1d] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e9cb1d] hover:text-black transition-all duration-300"
            >
              واتس اب
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
