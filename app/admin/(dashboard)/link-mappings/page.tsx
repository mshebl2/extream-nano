'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Link2, ExternalLink } from 'lucide-react';
import styles from './link-mappings.module.css';

interface LinkMapping {
    _id: string;
    keyword: string;
    keywordAr?: string;
    url: string;
    priority: number;
    caseSensitive: boolean;
    maxOccurrences: number;
    isActive: boolean;
    description?: string;
}

export default function LinkMappingsPage() {
    const [mappings, setMappings] = useState<LinkMapping[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMapping, setEditingMapping] = useState<LinkMapping | null>(null);
    const [formData, setFormData] = useState({
        keyword: '',
        keywordAr: '',
        url: '',
        priority: 0,
        caseSensitive: false,
        maxOccurrences: 1,
        isActive: true,
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchMappings();
    }, []);

    const fetchMappings = async () => {
        try {
            const res = await fetch('/api/link-mappings');
            if (res.ok) {
                const data = await res.json();
                setMappings(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Failed to fetch link mappings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingMapping(null);
        setFormData({
            keyword: '',
            keywordAr: '',
            url: '',
            priority: 0,
            caseSensitive: false,
            maxOccurrences: 1,
            isActive: true,
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (mapping: LinkMapping) => {
        setEditingMapping(mapping);
        setFormData({
            keyword: mapping.keyword,
            keywordAr: mapping.keywordAr || '',
            url: mapping.url,
            priority: mapping.priority,
            caseSensitive: mapping.caseSensitive,
            maxOccurrences: mapping.maxOccurrences,
            isActive: mapping.isActive,
            description: mapping.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الربط؟')) return;

        try {
            const res = await fetch(`/api/link-mappings/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage({ text: 'تم الحذف بنجاح', type: 'success' });
                fetchMappings();
            }
        } catch (error) {
            console.error('Failed to delete mapping:', error);
            setMessage({ text: 'فشل في الحذف', type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const url = editingMapping
                ? `/api/link-mappings/${editingMapping._id}`
                : '/api/link-mappings';
            const method = editingMapping ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ text: editingMapping ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح', type: 'success' });
                setIsModalOpen(false);
                fetchMappings();
            } else {
                const errorData = await res.json();
                setMessage({ text: errorData.message || 'فشل في الحفظ', type: 'error' });
            }
        } catch (error) {
            console.error('Failed to save mapping:', error);
            setMessage({ text: 'حدث خطأ أثناء الحفظ', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (mapping: LinkMapping) => {
        try {
            const res = await fetch(`/api/link-mappings/${mapping._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !mapping.isActive }),
            });

            if (res.ok) {
                fetchMappings();
            }
        } catch (error) {
            console.error('Failed to toggle mapping:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>الروابط الداخلية</h1>
                    <p className={styles.subtitle}>إدارة الكلمات المفتاحية المرتبطة بالروابط الداخلية تلقائياً</p>
                </div>
                <button onClick={handleAdd} className={styles.addButton}>
                    <Plus size={20} />
                    إضافة ربط جديد
                </button>
            </div>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.infoCard}>
                <Link2 size={24} />
                <div>
                    <h3>كيف تعمل الروابط الداخلية؟</h3>
                    <p>عند إضافة ربط جديد، سيتم تلقائياً تحويل الكلمات المفتاحية المحددة إلى روابط في محتوى المقالات. هذا يساعد في تحسين SEO وتجربة المستخدم.</p>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>جاري التحميل...</div>
            ) : mappings.length === 0 ? (
                <div className={styles.empty}>
                    <Link2 size={48} />
                    <p>لا توجد روابط داخلية حالياً</p>
                    <button onClick={handleAdd} className={styles.addButton}>
                        <Plus size={20} />
                        إضافة أول ربط
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {mappings.map((mapping) => (
                        <div key={mapping._id} className={`${styles.card} ${!mapping.isActive ? styles.inactive : ''}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.keyword}>{mapping.keyword}</div>
                                {mapping.keywordAr && (
                                    <div className={styles.keywordAr}>{mapping.keywordAr}</div>
                                )}
                                <button
                                    className={`${styles.statusBadge} ${mapping.isActive ? styles.active : styles.disabled}`}
                                    onClick={() => handleToggleActive(mapping)}
                                >
                                    {mapping.isActive ? 'نشط' : 'معطل'}
                                </button>
                            </div>
                            <div className={styles.cardUrl}>
                                <ExternalLink size={14} />
                                <span>{mapping.url}</span>
                            </div>
                            <div className={styles.cardMeta}>
                                <span>الأولوية: {mapping.priority}</span>
                                <span>الحد الأقصى: {mapping.maxOccurrences}</span>
                                {mapping.caseSensitive && <span>حساس لحالة الأحرف</span>}
                            </div>
                            {mapping.description && (
                                <div className={styles.cardDescription}>{mapping.description}</div>
                            )}
                            <div className={styles.cardActions}>
                                <button onClick={() => handleEdit(mapping)} className={styles.editButton}>
                                    <Pencil size={16} />
                                    تعديل
                                </button>
                                <button onClick={() => handleDelete(mapping._id)} className={styles.deleteButton}>
                                    <Trash2 size={16} />
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            {editingMapping ? 'تعديل الربط' : 'إضافة ربط جديد'}
                        </h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الكلمة المفتاحية (English) *</label>
                                    <input
                                        type="text"
                                        value={formData.keyword}
                                        onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                                        placeholder="e.g., nano ceramic"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الكلمة المفتاحية (عربي)</label>
                                    <input
                                        type="text"
                                        value={formData.keywordAr}
                                        onChange={(e) => setFormData({ ...formData, keywordAr: e.target.value })}
                                        placeholder="مثال: نانو سيراميك"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>الرابط المستهدف *</label>
                                <input
                                    type="text"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="/services/nano-ceramic"
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الأولوية</label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                        min={0}
                                        max={100}
                                    />
                                    <small>الأرقام الأعلى تُطبق أولاً</small>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الحد الأقصى للظهور</label>
                                    <input
                                        type="number"
                                        value={formData.maxOccurrences}
                                        onChange={(e) => setFormData({ ...formData, maxOccurrences: parseInt(e.target.value) || 1 })}
                                        min={1}
                                        max={10}
                                    />
                                    <small>لكل مقالة</small>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>ملاحظة (للمدير فقط)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="وصف اختياري للربط"
                                />
                            </div>

                            <div className={styles.checkboxRow}>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.caseSensitive}
                                        onChange={(e) => setFormData({ ...formData, caseSensitive: e.target.checked })}
                                    />
                                    <span>حساس لحالة الأحرف</span>
                                </label>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span>نشط</span>
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                    إلغاء
                                </button>
                                <button type="submit" className={styles.submitButton} disabled={saving}>
                                    {saving ? 'جاري الحفظ...' : editingMapping ? 'حفظ التغييرات' : 'إضافة الربط'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
