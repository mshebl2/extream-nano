'use client';

import { useState, useEffect } from 'react';
import { Upload, Check, ImageIcon, Loader2 } from 'lucide-react';
import styles from './site-images.module.css';

interface SiteImage {
    key: string;
    url: string;
    imageFileId?: string;
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/site-images', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched images from API:', data);
                if (Array.isArray(data)) {
                    // If we have images from DB, use them, otherwise merge with defaults
                    if (data.length > 0) {
                        // Merge DB images with defaults to ensure all keys are present
                        const dbImageMap = new Map(data.map(img => [img.key, img]));
                        const merged = DEFAULT_IMAGES.map(defaultImg => {
                            const dbImg = dbImageMap.get(defaultImg.key);
                            if (dbImg) {
                                // Ensure URL is correctly set from imageFileId if needed
                                const url = dbImg.imageFileId ? `/api/images/${dbImg.imageFileId}` : (dbImg.url || defaultImg.url);
                                return { ...dbImg, url };
                            }
                            return defaultImg;
                        });
                        setImages(merged);
                    } else {
                        // No images in DB, use defaults
                        setImages(DEFAULT_IMAGES);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
            // On error, use defaults
            setImages(DEFAULT_IMAGES);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (image: SiteImage) => {
        setEditingKey(image.key);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('الرجاء اختيار ملف صورة');
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSave = async (key: string) => {
        if (!selectedFile) {
            alert('الرجاء اختيار ملف صورة');
            return;
        }

        setSaving(key);
        try {
            // First, upload the file
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadRes = await fetch('/api/images/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Upload error:', errorData);
                throw new Error(errorData.error || 'فشل رفع الصورة');
            }

            const uploadData = await uploadRes.json();
            console.log('Upload response:', uploadData);
            const { fileId } = uploadData;

            if (!fileId) {
                console.error('No fileId in response:', uploadData);
                throw new Error('فشل في الحصول على معرف الملف');
            }

            // Then, update the site image with the file ID (don't send url, let API construct it)
            const res = await fetch('/api/site-images', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, imageFileId: fileId }),
            });

            if (res.ok) {
                const updatedImage = await res.json();
                console.log('Updated image from API:', updatedImage);
                
                // Use the URL from the API response which should be correctly constructed
                const imageUrl = updatedImage.url || `/api/images/${fileId}`;
                
                // Update local state immediately
                setImages(images.map(img =>
                    img.key === key ? { 
                        ...img, 
                        url: imageUrl, 
                        imageFileId: updatedImage.imageFileId || fileId 
                    } : img
                ));
                
                setEditingKey(null);
                setSelectedFile(null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
                
                // Refresh images to ensure we have the latest from DB
                await fetchImages();
                
                alert('تم تحديث الصورة بنجاح! قد تحتاج إلى تحديث الصفحة لرؤية التغييرات.');
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || 'فشل في حفظ الصورة');
            }
        } catch (error: any) {
            console.error('Failed to save image:', error);
            const errorMessage = error?.message || 'فشل في حفظ الصورة';
            alert(`فشل في حفظ الصورة: ${errorMessage}`);
        } finally {
            setSaving(null);
        }
    };

    const handleCancel = () => {
        setEditingKey(null);
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
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
                                            <img 
                                                src={image.url} 
                                                alt={image.label}
                                                onError={(e) => {
                                                    console.error('Failed to load image:', image.url, 'imageFileId:', image.imageFileId);
                                                    // Show placeholder on error
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
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
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className={styles.fileInput}
                                                    id={`file-input-${image.key}`}
                                                />
                                                <label 
                                                    htmlFor={`file-input-${image.key}`}
                                                    className={styles.fileInputLabel}
                                                >
                                                    <Upload size={16} />
                                                    {selectedFile ? selectedFile.name : 'اختر ملف صورة'}
                                                </label>
                                                {previewUrl && (
                                                    <div className={styles.previewContainer}>
                                                        <img 
                                                            src={previewUrl} 
                                                            alt="Preview" 
                                                            className={styles.previewImage}
                                                        />
                                                    </div>
                                                )}
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
                                                        disabled={saving === image.key || !selectedFile}
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
