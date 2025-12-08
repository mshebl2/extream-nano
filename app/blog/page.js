import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { unstable_cache } from 'next/cache';
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export const dynamic = 'force-dynamic';
export const revalidate = 14400; // 4 hours in seconds

// Cached blog fetching function
const getBlogs = unstable_cache(
  async () => {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return blogs.map((blog) => ({
      _id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      titleAr: blog.titleAr,
      description: blog.description,
      descriptionAr: blog.descriptionAr,
      image: blog.imageFileId ? `/api/images/${blog.imageFileId}` : blog.image,
    }));
  },
  ['blogs-list'],
  { revalidate: 14400, tags: ['blogs'] }
);

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">المدونة</h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100"
            >
              <img
                src={post.image}
                alt={post.titleAr}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-right">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {post.titleAr}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{post.descriptionAr}</p>
                <Link
                  href={`/blog/${encodeURIComponent(post.slug)}`}
                  className="text-[#7F3F97] font-semibold hover:underline"
                >
                  قراءة المقال →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
