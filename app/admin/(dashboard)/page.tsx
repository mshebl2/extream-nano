import connectDB from '@/lib/db';
import Service from '@/models/Service';
import Blog from '@/models/Blog';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        await connectDB();
        const servicesCount = await Service.countDocuments();
        const blogsCount = await Blog.countDocuments();
        return { servicesCount, blogsCount };
    } catch (error) {
        console.error('Failed to connect to database:', error);
        return { servicesCount: 0, blogsCount: 0 };
    }
}

export default async function DashboardPage() {
    const { servicesCount, blogsCount } = await getStats();

    return <DashboardClient stats={{ servicesCount, blogsCount }} />;
}

