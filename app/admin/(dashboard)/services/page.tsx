'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './services.module.css';

interface Service {
    _id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    slug: string;
    image?: string;
    featured?: boolean;
    order?: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        slug: '',
        image: '',
        featured: false,
        order: 0,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            if (res.ok) {
                const data = await res.json();
                setServices(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingService(null);
        setFormData({
            title: '',
            titleAr: '',
            description: '',
            descriptionAr: '',
            slug: '',
            image: '',
            featured: false,
            order: 0,
        });
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            titleAr: service.titleAr,
            description: service.description,
            descriptionAr: service.descriptionAr,
            slug: service.slug,
            image: service.image || '',
            featured: service.featured || false,
            order: service.order || 0,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to delete service:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingService
                ? `/api/services/${editingService._id}`
                : '/api/services';
            const method = editingService ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchServices();
            }
        } catch (error) {
            console.error('Failed to save service:', error);
        } finally {
            setSaving(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>إدارة الخدمات</h1>
                    <p className={styles.subtitle}>إضافة وتعديل خدمات التلميع والحماية</p>
                </div>
                <button onClick={handleAdd} className={styles.addButton}>
                    <Plus size={20} />
                    إضافة خدمة جديدة
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>جاري التحميل...</div>
            ) : services.length === 0 ? (
                <div className={styles.empty}>
                    <p>لا توجد خدمات حالياً</p>
                    <button onClick={handleAdd} className={styles.addButton}>
                        <Plus size={20} />
                        إضافة أول خدمة
                    </button>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الترتيب</th>
                                <th>العنوان (عربي)</th>
                                <th>العنوان (إنجليزي)</th>
                                <th>الرابط</th>
                                <th>مميز</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service._id}>
                                    <td>{service.order || 0}</td>
                                    <td>{service.titleAr}</td>
                                    <td>{service.title}</td>
                                    <td className={styles.slug}>{service.slug}</td>
                                    <td>
                                        <span className={`${styles.badge} ${service.featured ? styles.badgeFeatured : ''}`}>
                                            {service.featured ? 'نعم' : 'لا'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className={styles.editButton}
                                                title="تعديل"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
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
                            {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                        </h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>العنوان (عربي)</label>
                                    <input
                                        type="text"
                                        value={formData.titleAr}
                                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>العنوان (إنجليزي)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                                slug: generateSlug(e.target.value),
                                            });
                                        }}
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
                                <label>رابط الصورة</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="/images/service.jpg"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الترتيب</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <span>خدمة مميزة</span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                    إلغاء
                                </button>
                                <button type="submit" className={styles.submitButton} disabled={saving}>
                                    {saving ? 'جاري الحفظ...' : editingService ? 'حفظ التغييرات' : 'إضافة الخدمة'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
