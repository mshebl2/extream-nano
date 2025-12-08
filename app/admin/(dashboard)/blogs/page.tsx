'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import styles from './blogs.module.css';

interface Blog {
    _id: string;
    title: string;
    titleAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    image?: string;
    featured?: boolean;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        slug: '',
        image: '',
        imageFileId: '',
        featured: false,
    });
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            if (res.ok) {
                const data = await res.json();
                setBlogs(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBlog(null);
        setFormData({
            title: '',
            titleAr: '',
            description: '',
            descriptionAr: '',
            slug: '',
            image: '',
            imageFileId: '',
            featured: false,
        });
        setImagePreview('');
        setIsModalOpen(true);
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        const imageUrl = (blog as any).imageFileId 
            ? `/api/images/${(blog as any).imageFileId}` 
            : blog.image || '';
        setFormData({
            title: blog.title,
            titleAr: blog.titleAr,
            description: blog.description,
            descriptionAr: blog.descriptionAr,
            slug: blog.slug,
            image: blog.image || '',
            imageFileId: (blog as any).imageFileId || '',
            featured: blog.featured || false,
        });
        setImagePreview(imageUrl);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBlogs();
            }
        } catch (error) {
            console.error('Failed to delete blog:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingBlog
                ? `/api/blogs/${editingBlog._id}`
                : '/api/blogs';
            const method = editingBlog ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchBlogs();
            }
        } catch (error) {
            console.error('Failed to save blog:', error);
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s\u0600-\u06FF-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const res = await fetch('/api/images/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    imageFileId: data.fileId,
                    image: data.url,
                }));
                setImagePreview(data.url);
            } else {
                alert('فشل رفع الصورة');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('فشل رفع الصورة');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>إدارة المدونة</h1>
                    <p className={styles.subtitle}>إضافة وتعديل مقالات المدونة</p>
                </div>
                <button onClick={handleAdd} className={styles.addButton}>
                    <Plus size={20} />
                    إضافة مقال جديد
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>جاري التحميل...</div>
            ) : blogs.length === 0 ? (
                <div className={styles.empty}>
                    <p>لا توجد مقالات حالياً</p>
                    <button onClick={handleAdd} className={styles.addButton}>
                        <Plus size={20} />
                        إضافة أول مقال
                    </button>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>العنوان (عربي)</th>
                                <th>العنوان (إنجليزي)</th>
                                <th>الرابط</th>
                                <th>مميز</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td>{blog.titleAr}</td>
                                    <td>{blog.title}</td>
                                    <td className={styles.slug}>{blog.slug}</td>
                                    <td>
                                        <span className={`${styles.badge} ${blog.featured ? styles.badgeFeatured : ''}`}>
                                            {blog.featured ? 'نعم' : 'لا'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className={styles.editButton}
                                                title="تعديل"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className={styles.deleteButton}
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            {editingBlog ? 'تعديل المقال' : 'إضافة مقال جديد'}
                        </h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>العنوان (عربي)</label>
                                    <input
                                        type="text"
                                        value={formData.titleAr}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                titleAr: e.target.value,
                                                slug: generateSlug(e.target.value),
                                            });
                                        }}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>العنوان (إنجليزي)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>الرابط (Slug)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الوصف (عربي)</label>
                                    <textarea
                                        value={formData.descriptionAr}
                                        onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الوصف (إنجليزي)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>صورة المقال</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                                {uploadingImage && <p style={{ color: '#7F3F97', fontSize: '0.875rem' }}>جاري رفع الصورة...</p>}
                                {imagePreview && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="أو أدخل رابط الصورة يدوياً"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    />
                                    <span>مقال مميز</span>
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                    إلغاء
                                </button>
                                <button type="submit" className={styles.submitButton} disabled={saving}>
                                    {saving ? 'جاري الحفظ...' : editingBlog ? 'حفظ التغييرات' : 'إضافة المقال'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
