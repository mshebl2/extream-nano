'use client';

import { useState, useEffect } from 'react';
import { Upload, Check, ImageIcon, Loader2 } from 'lucide-react';
import styles from './site-images.module.css';

interface SiteImage {
    key: string;
    url: string;
    label: string;
    description?: string;
    section: string;
}

const DEFAULT_IMAGES: SiteImage[] = [
    { key: 'hero.background', url: '/images/hero-bg.jpg', label: 'صورة خلفية الهيرو', description: 'الصورة الرئيسية في أعلى الصفحة', section: 'الصفحة الرئيسية' },
    { key: 'about.image', url: '/images/about.jpg', label: 'صورة قسم من نحن', description: 'الصورة في قسم من نحن', section: 'الصفحة الرئيسية' },
    { key: 'services.background', url: '/images/services-bg.jpg', label: 'خلفية الخدمات', description: 'خلفية قسم الخدمات', section: 'الصفحة الرئيسية' },
    { key: 'warranty.image', url: '/images/warranty.jpg', label: 'صورة الضمان', description: 'الصورة في قسم الضمان', section: 'الصفحة الرئيسية' },
    { key: 'contact.background', url: '/images/contact-bg.jpg', label: 'خلفية التواصل', description: 'خلفية قسم التواصل', section: 'التواصل' },
];

export default function SiteImagesPage() {
    const [images, setImages] = useState<SiteImage[]>(DEFAULT_IMAGES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [tempUrl, setTempUrl] = useState('');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/site-images');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setImages(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (image: SiteImage) => {
        setEditingKey(image.key);
        setTempUrl(image.url);
    };

    const handleSave = async (key: string) => {
        setSaving(key);
        try {
            const res = await fetch('/api/site-images', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, url: tempUrl }),
            });

            if (res.ok) {
                setImages(images.map(img =>
                    img.key === key ? { ...img, url: tempUrl } : img
                ));
                setEditingKey(null);
            }
        } catch (error) {
            console.error('Failed to save image:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleCancel = () => {
        setEditingKey(null);
        setTempUrl('');
    };

    const groupedImages = images.reduce((acc, img) => {
        if (!acc[img.section]) acc[img.section] = [];
        acc[img.section].push(img);
        return acc;
    }, {} as Record<string, SiteImage[]>);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>صور الموقع</h1>
                    <p className={styles.subtitle}>تحديث صور الأقسام المختلفة في الموقع</p>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <Loader2 className={styles.spinner} size={32} />
                    <span>جاري تحميل الصور...</span>
                </div>
            ) : (
                Object.entries(groupedImages).map(([section, sectionImages]) => (
                    <div key={section} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{section}</h2>
                        <div className={styles.grid}>
                            {sectionImages.map((image) => (
                                <div key={image.key} className={styles.imageCard}>
                                    <div className={styles.imagePreview}>
                                        {image.url ? (
                                            <img src={image.url} alt={image.label} />
                                        ) : (
                                            <div className={styles.placeholder}>
                                                <ImageIcon size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.imageInfo}>
                                        <h3>{image.label}</h3>
                                        {image.description && <p>{image.description}</p>}

                                        {editingKey === image.key ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={tempUrl}
                                                    onChange={(e) => setTempUrl(e.target.value)}
                                                    placeholder="رابط الصورة"
                                                    className={styles.input}
                                                />
                                                <div className={styles.editActions}>
                                                    <button
                                                        onClick={handleCancel}
                                                        className={styles.cancelButton}
                                                    >
                                                        إلغاء
                                                    </button>
                                                    <button
                                                        onClick={() => handleSave(image.key)}
                                                        className={styles.saveButton}
                                                        disabled={saving === image.key}
                                                    >
                                                        {saving === image.key ? (
                                                            <Loader2 size={16} className={styles.spinner} />
                                                        ) : (
                                                            <Check size={16} />
                                                        )}
                                                        حفظ
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(image)}
                                                className={styles.editButton}
                                            >
                                                <Upload size={16} />
                                                تغيير الصورة
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
