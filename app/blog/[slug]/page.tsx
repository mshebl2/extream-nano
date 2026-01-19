import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import InternalLinkMapping from "@/models/InternalLinkMapping";
import SEOConfig from "@/models/SEOConfig";
import { applyInternalLinks } from "@/lib/seo-utils";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getBlogBySlug(slug: string) {
  try {
    await connectDB();
    // Decode the slug in case it's URL encoded
    let decodedSlug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {
      decodedSlug = slug; // If decoding fails, use original
    }

    // Try to find blog with decoded slug first
    let blog = await Blog.findOne({ slug: decodedSlug }).lean();

    // If not found, try with the original slug (in case it's stored encoded)
    if (!blog) {
      blog = await Blog.findOne({ slug: slug }).lean();
    }

    if (!blog) return null;

    // Get SEO config and link mappings for internal links
    const seoConfig = await SEOConfig.findOne({ configKey: 'global' }).lean();
    const globalAutoInternalLinks = seoConfig?.globalAutoInternalLinks ?? true;
    const maxInternalLinksPerPost = seoConfig?.maxInternalLinksPerPost ?? 5;

    // Get content to process
    let processedContent = blog.contentAr || blog.content || '';

    // Apply internal links if enabled
    if (globalAutoInternalLinks && (blog.autoInternalLinks !== false)) {
      const linkMappings = await InternalLinkMapping.find({ isActive: true })
        .sort({ priority: -1 })
        .lean();

      if (linkMappings.length > 0) {
        processedContent = applyInternalLinks(
          processedContent,
          linkMappings.map(m => ({
            keyword: m.keyword,
            keywordAr: m.keywordAr,
            url: m.url,
            maxOccurrences: m.maxOccurrences,
            caseSensitive: m.caseSensitive,
          })),
          maxInternalLinksPerPost
        );
      }
    }

    return {
      ...blog,
      _id: blog._id.toString(),
      image: blog.imageFileId ? `/api/images/${blog.imageFileId}` : blog.image,
      processedContent,
    };
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const blog = await getBlogBySlug(decodedSlug);

    if (!blog) {
      return { title: 'المقال غير موجود' };
    }

    // اسم الموقع من ملف env
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "اكستريم نانو";

    return {
      title: `${blog.titleAr} | ${siteName}`,
      description: blog.descriptionAr,
      openGraph: {
        title: `${blog.titleAr} | ${siteName}`,
        description: blog.descriptionAr,
        images: blog.image ? [blog.image] : [],
      },
      twitter: {
        title: `${blog.titleAr} | ${siteName}`,
        description: blog.descriptionAr,
        images: blog.image ? [blog.image] : [],
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'المقال غير موجود' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const blog = await getBlogBySlug(decodedSlug);

    if (!blog) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <Header />

        <article className="max-w-4xl mx-auto px-4 py-24">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-[#7F3F97] font-semibold hover:underline"
            >
              ← العودة للمدونة
            </Link>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.titleAr}
              className="w-full h-80 object-cover rounded-2xl mb-8 shadow-lg"
            />
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#7F3F97] mb-6 text-right">
            {blog.titleAr}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 text-right leading-relaxed">
            {blog.descriptionAr}
          </p>

          {/* Content */}
          {blog.processedContent && (
            <div
              className="prose prose-lg max-w-none text-right blog-content"
              dir="rtl"
              dangerouslySetInnerHTML={{
                __html: blog.processedContent,
              }}
            />
          )}

          {/* CTA Section */}
          <section className="blog-cta-section mt-16 py-12 bg-[#7F3F97] text-center text-white rounded-3xl">
            <h2 className="text-3xl font-bold text-[#e9cb1d] mb-4">
              جاهز لتجربة الأفضل؟
            </h2>
            <p className="mb-6 text-lg text-white" style={{ color: '#ffffff' }}>
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
        </article>

        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
