import mongoose from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://eslamabdaltif:oneone2@cluster0.vmq8phq.mongodb.net/xtreme-nano?retryWrites=true&w=majority';

// Service data
const services = [
    {
        slug: 'ppf',
        titleAr: 'فيلم حماية الطلاء (PPF)',
        descriptionAr: 'احمِ سيارتك من المخاطر اليومية، مثل الخدوش والصدمات وبقع الحشرات والطقس القاسي، مع فيلم حماية الطلاء عالي الجودة.',
        longDescription: 'Paint protection film ensures your car is protected from weather, dust, and daily scratches. Suitable for all car types in Riyadh.',
        longDescriptionAr: 'فيلم حماية الطلاء يضمن حماية السيارة من العوامل الجوية والأتربة والخدوش اليومية. مناسب لجميع أنواع السيارات في الرياض.',
        image: '/pff.png',
        featured: true,
        order: 1,
    },
    {
        slug: 'tint',
        titleAr: 'تظليل النوافذ',
        descriptionAr: 'صُممت حلول تظليل النوافذ المتميزة لدينا لعزل الحرارة بشكل مثالي، وحماية من الأشعة فوق البنفسجية، وتعزيز الخصوصية.',
        longDescription: 'Tinting keeps your car cool and reduces harmful sun rays, making driving in Riyadh more comfortable and private.',
        longDescriptionAr: 'التظليل يحافظ على برودة السيارة ويقلل أشعة الشمس الضارة، مما يجعل قيادة سيارتك في الرياض أكثر راحة وخصوصية.',
        image: '/tzlel.png',
        featured: true,
        order: 2,
    },
    {
        slug: 'nano-exterior',
        titleAr: 'النانو سيراميك خارجي',
        descriptionAr: 'عزز لمعان سيارتك ومتانتها على المدى الطويل مع طلاء النانو سيراميك المتطور لدينا. يقاوم الماء والأوساخ والملوثات.',
        longDescription: 'Exterior nano ceramic provides protection against minor scratches, dirt, and rain, with a long-lasting shine in Riyadh\'s hot climate.',
        longDescriptionAr: 'النانو سيراميك الخارجي يمنح السيارة حماية ضد الخدوش البسيطة، الأوساخ، والأمطار، مع لمعان يدوم طويلاً في مناخ الرياض الحار.',
        image: '/tlme3.png',
        featured: true,
        order: 3,
    },
    {
        slug: 'nano-interior',
        titleAr: 'النانو سيراميك داخلي',
        descriptionAr: 'حافظ على مظهر سيارتك الداخلي منتعشاً مع معالجاتنا المتخصصة للأسطح القماشية والجلدية.',
        longDescription: 'Interior nano ceramic protects surfaces from stains and dust, makes cleaning easier and ensures a luxurious interior look always.',
        longDescriptionAr: 'النانو سيراميك الداخلي يحمي الأسطح من البقع والغبار، ويجعل تنظيف السيارة أسهل ويضمن مظهر داخلي فاخر دائمًا.',
        image: '/nano.png',
        featured: true,
        order: 4,
    },
    {
        slug: 'polishing',
        titleAr: 'تلميع داخلي وخارجي',
        descriptionAr: 'خدمة تلميع شاملة للداخل والخارج لإعطاء سيارتك لمعاناً استثنائياً ومظهراً جديداً يدوم طويلاً.',
        longDescription: 'Polishing restores your car\'s new appearance, removes minor scratches and fading, with additional protection for the car paint in Riyadh.',
        longDescriptionAr: 'التلميع يعيد للسيارة مظهرها الجديد، ويزيل الخدوش البسيطة والبهتان، مع حماية إضافية لطلاء السيارة في الرياض.',
        image: '/tlme33.png',
        featured: true,
        order: 5,
    },
    {
        slug: 'premium',
        titleAr: 'خدمات مميزة لسيارتك',
        descriptionAr: 'استمتع بأقصى درجات الدلال لسيارتك مع خدمات العناية الفائقة من اكس تريم نانو.',
        longDescription: 'Premium services include comprehensive cleaning, paint protection, polishing, and tinting for a unique car experience in Riyadh.',
        longDescriptionAr: 'خدمات مميزة تشمل تنظيف شامل، حماية طلاء، تلميع، وتظليل، لتجربة فريدة لسيارتك في الرياض.',
        image: '/hero.png',
        featured: true,
        order: 6,
    },
];

// Blog data
const blogs = [
    {
        slug: 'العناية-بالسيارات-بالرياض',
        titleAr: 'خدمات العناية بالسيارات بالرياض – من اكستريم نانو Xtreme Nano',
        descriptionAr: 'اكتشف اكستريم نانو بالرياض، المركز الأفضل في العناية المتكاملة بالسيارات. نقدم حماية الطلاء الأصلية، تلميع النانو سيراميك، العزل الحراري، والتنظيف الداخلي الفاخر بأعلى جودة.',
        content: 'Discover Xtreme Nano in Riyadh, the best center for comprehensive car care. We offer original paint protection, nano ceramic polishing, thermal insulation, and luxury interior cleaning with the highest quality. Experience and professionalism that keeps your car always like new. Book now at Xtreme Nano Riyadh and enjoy a service worthy of your luxury car!',
        contentAr: 'اكتشف اكستريم نانو بالرياض، المركز الأفضل في العناية المتكاملة بالسيارات. نقدم حماية الطلاء الأصلية، تلميع النانو سيراميك، العزل الحراري، والتنظيف الداخلي الفاخر بأعلى جودة. خبرة واحترافية تجعل سيارتك دائمًا كالجديدة. احجز الآن في اكستريم نانو بالرياض وتمتع بخدمة تليق بسيارتك الفاخرة!',
        image: '/001.png',
        featured: true,
    },
    {
        slug: 'حماية-السيارات-بالرياض',
        titleAr: 'حماية السيارات بالرياض من اكستريم نانو | أفضل تقنيات XPEL وPPF والنانو سيراميك لعام 2025',
        descriptionAr: 'حماية سيارتك تبدأ من اكستريم نانو بالرياض! اكتشف أحدث تقنيات حماية الطلاء باستخدام أفلام XPEL وPPF والنانو سيراميك لعام 2025 مع ضمانات معتمدة وجودة عالمية تحافظ على لمعان سيارتك ومظهرها الفاخر.',
        content: 'Your car\'s protection starts at Xtreme Nano Riyadh! Discover the latest paint protection technologies using XPEL and PPF films and nano ceramic for 2025 with certified warranties and world-class quality that maintains your car\'s shine and luxurious appearance.',
        contentAr: 'حماية سيارتك تبدأ من اكستريم نانو بالرياض! اكتشف أحدث تقنيات حماية الطلاء باستخدام أفلام XPEL وPPF والنانو سيراميك لعام 2025 مع ضمانات معتمدة وجودة عالمية تحافظ على لمعان سيارتك ومظهرها الفاخر.',
        image: '/28.png',
        featured: true,
    },
];

// Site images data
const siteImages = [
    { key: 'hero.background', url: '/hero.png', label: 'صورة خلفية الهيرو', description: 'الصورة الرئيسية في أعلى الصفحة', section: 'الصفحة الرئيسية' },
    { key: 'about.image', url: '/aboutus.png', label: 'صورة قسم من نحن', description: 'الصورة في قسم من نحن', section: 'الصفحة الرئيسية' },
    { key: 'services.ppf', url: '/pff.png', label: 'صورة خدمة PPF', description: 'صورة فيلم حماية الطلاء', section: 'الخدمات' },
    { key: 'services.tint', url: '/tzlel.png', label: 'صورة خدمة التظليل', description: 'صورة تظليل النوافذ', section: 'الخدمات' },
    { key: 'services.nano-exterior', url: '/tlme3.png', label: 'صورة النانو الخارجي', description: 'صورة النانو سيراميك خارجي', section: 'الخدمات' },
    { key: 'services.nano-interior', url: '/nano.png', label: 'صورة النانو الداخلي', description: 'صورة النانو سيراميك داخلي', section: 'الخدمات' },
    { key: 'services.polishing', url: '/tlme33.png', label: 'صورة التلميع', description: 'صورة خدمة التلميع', section: 'الخدمات' },
    { key: 'gallery.001', url: '/001.png', label: 'صورة معرض 1', description: 'صورة من معرض الأعمال', section: 'المعرض' },
    { key: 'gallery.002', url: '/002.png', label: 'صورة معرض 2', description: 'صورة من معرض الأعمال', section: 'المعرض' },
    { key: 'gallery.003', url: '/003.png', label: 'صورة معرض 3', description: 'صورة من معرض الأعمال', section: 'المعرض' },
    { key: 'gallery.004', url: '/004.png', label: 'صورة معرض 4', description: 'صورة من معرض الأعمال', section: 'المعرض' },
    { key: 'gallery.005', url: '/005.png', label: 'صورة معرض 5', description: 'صورة من معرض الأعمال', section: 'المعرض' },
    { key: 'gallery.006', url: '/006.png', label: 'صورة معرض 6', description: 'صورة من معرض الأعمال', section: 'المعرض' },
];

async function uploadImageToGridFS(bucket: GridFSBucket, imagePath: string): Promise<string | null> {
    const publicPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));

    if (!fs.existsSync(publicPath)) {
        console.log(`  ⚠ Image not found: ${publicPath}`);
        return null;
    }

    const buffer = fs.readFileSync(publicPath);
    const filename = path.basename(imagePath);
    const contentType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                contentType,
                originalPath: imagePath,
                uploadedAt: new Date(),
            },
        });

        uploadStream.on('finish', () => {
            console.log(`  ✓ Uploaded: ${filename}`);
            resolve(uploadStream.id.toString());
        });

        uploadStream.on('error', (err) => {
            console.error(`  ✗ Failed to upload ${filename}:`, err);
            reject(err);
        });

        uploadStream.end(buffer);
    });
}

async function seed() {
    console.log('🚀 Starting database seed...\n');

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB\n');

    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    // Seed Services
    console.log('📦 Seeding Services...');
    const servicesCollection = db.collection('services');
    await servicesCollection.deleteMany({});

    for (const service of services) {
        // Upload image to GridFS
        let imageFileId = null;
        if (service.image) {
            imageFileId = await uploadImageToGridFS(bucket, service.image);
        }

        await servicesCollection.insertOne({
            ...service,
            imageFileId,
            createdAt: new Date(),
        });
        console.log(`  ✓ Added service: ${service.titleAr}`);
    }
    console.log(`✓ Seeded ${services.length} services\n`);

    // Seed Blogs
    console.log('📝 Seeding Blogs...');
    const blogsCollection = db.collection('blogs');
    await blogsCollection.deleteMany({});

    for (const blog of blogs) {
        // Upload image to GridFS
        let imageFileId = null;
        if (blog.image) {
            imageFileId = await uploadImageToGridFS(bucket, blog.image);
        }

        await blogsCollection.insertOne({
            ...blog,
            imageFileId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log(`  ✓ Added blog: ${blog.titleAr}`);
    }
    console.log(`✓ Seeded ${blogs.length} blogs\n`);

    // Seed Site Images
    console.log('🖼 Seeding Site Images...');
    const siteImagesCollection = db.collection('siteimages');
    await siteImagesCollection.deleteMany({});

    for (const siteImage of siteImages) {
        // Upload image to GridFS
        let imageFileId = null;
        if (siteImage.url) {
            imageFileId = await uploadImageToGridFS(bucket, siteImage.url);
        }

        await siteImagesCollection.insertOne({
            ...siteImage,
            imageFileId,
            url: imageFileId ? `/api/images/${imageFileId}` : siteImage.url,
            updatedAt: new Date(),
        });
        console.log(`  ✓ Added site image: ${siteImage.key}`);
    }
    console.log(`✓ Seeded ${siteImages.length} site images\n`);

    await client.close();
    console.log('✅ Database seeding completed successfully!');
}

seed().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
