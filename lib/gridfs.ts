import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient: MongoClient | null = null;
let cachedBucket: GridFSBucket | null = null;

async function getGridFSBucket(): Promise<GridFSBucket> {
    if (cachedBucket) {
        return cachedBucket;
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI not defined');
    }

    if (!cachedClient) {
        cachedClient = new MongoClient(MONGODB_URI);
        await cachedClient.connect();
    }

    const db = cachedClient.db();
    cachedBucket = new GridFSBucket(db, { bucketName: 'images' });

    return cachedBucket;
}

export async function uploadToGridFS(
    buffer: Buffer,
    filename: string,
    contentType: string
): Promise<string> {
    const bucket = await getGridFSBucket();

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                contentType,
                uploadedAt: new Date(),
            },
        });

        uploadStream.on('finish', () => {
            resolve(uploadStream.id.toString());
        });

        uploadStream.on('error', reject);

        uploadStream.end(buffer);
    });
}

export async function getFromGridFS(fileId: string): Promise<{ buffer: Buffer; contentType: string; filename: string } | null> {
    try {
        const bucket = await getGridFSBucket();
        const _id = new ObjectId(fileId);

        // Get file info
        const files = await bucket.find({ _id }).toArray();
        if (files.length === 0) {
            return null;
        }

        const file = files[0];
        const chunks: Buffer[] = [];

        const downloadStream = bucket.openDownloadStream(_id);

        return new Promise((resolve, reject) => {
            downloadStream.on('data', (chunk) => chunks.push(chunk));
            downloadStream.on('error', reject);
            downloadStream.on('end', () => {
                resolve({
                    buffer: Buffer.concat(chunks),
                    contentType: (file.metadata as any)?.contentType || 'image/png',
                    filename: file.filename,
                });
            });
        });
    } catch (error) {
        console.error('Error getting file from GridFS:', error);
        return null;
    }
}

export async function deleteFromGridFS(fileId: string): Promise<boolean> {
    try {
        const bucket = await getGridFSBucket();
        await bucket.delete(new ObjectId(fileId));
        return true;
    } catch (error) {
        console.error('Error deleting file from GridFS:', error);
        return false;
    }
}

export async function uploadFileToGridFS(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return uploadToGridFS(buffer, file.name, file.type);
}
