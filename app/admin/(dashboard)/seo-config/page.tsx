'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import styles from './seo-config.module.css';

interface SEOConfig {
    _id: string;
    globalAutoSEO: boolean;
    globalAutoInternalLinks: boolean;
    maxInternalLinksPerPost: number;
    defaultMetaKeywordsCount: number;
    siteName: string;
    siteNameAr: string;
    defaultOGImage: string;
    twitterHandle: string;
}

export default function SEOConfigPage() {
    const [config, setConfig] = useState<SEOConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/seo-config');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Failed to fetch SEO config:', error);
            setMessage({ text: 'فشل في تحميل الإعدادات', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/seo-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (res.ok) {
                setMessage({ text: 'تم حفظ الإعدادات بنجاح', type: 'success' });
                fetchConfig();
            } else {
                setMessage({ text: 'فشل في حفظ الإعدادات', type: 'error' });
            }
        } catch (error) {
            console.error('Failed to save config:', error);
            setMessage({ text: 'حدث خطأ أثناء الحفظ', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof SEOConfig, value: any) => {
        if (!config) return;
        setConfig({ ...config, [field]: value });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>إعدادات SEO</h1>
                    <p className={styles.subtitle}>تحسين محركات البحث والتحكم في الإعدادات العامة</p>
                </div>
                <button onClick={handleSave} className={styles.saveButton} disabled={saving}>
                    {saving ? <RefreshCw size={20} className={styles.spin} /> : <Save size={20} />}
                    {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
            </div>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {config && (
                <div className={styles.content}>
                    {/* Global Automation Settings */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>إعدادات الأتمتة</h2>
                        <div className={styles.togglesGrid}>
                            <div className={styles.toggleCard}>
                                <div className={styles.toggleInfo}>
                                    <h3>إنشاء SEO تلقائي</h3>
                                    <p>توليد العناوين والأوصاف والكلمات المفتاحية تلقائياً للمقالات الجديدة</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={config.globalAutoSEO}
                                        onChange={(e) => updateField('globalAutoSEO', e.target.checked)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.toggleCard}>
                                <div className={styles.toggleInfo}>
                                    <h3>روابط داخلية تلقائية</h3>
                                    <p>إضافة روابط داخلية تلقائياً في المقالات بناءً على الكلمات المفتاحية</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={config.globalAutoInternalLinks}
                                        onChange={(e) => updateField('globalAutoInternalLinks', e.target.checked)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Default Configuration */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>الإعدادات الافتراضية</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>اسم الموقع (English)</label>
                                <input
                                    type="text"
                                    value={config.siteName}
                                    onChange={(e) => updateField('siteName', e.target.value)}
                                    placeholder="XTREME NANO"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>اسم الموقع (عربي)</label>
                                <input
                                    type="text"
                                    value={config.siteNameAr}
                                    onChange={(e) => updateField('siteNameAr', e.target.value)}
                                    placeholder="اكستريم نانو"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>حساب Twitter</label>
                                <input
                                    type="text"
                                    value={config.twitterHandle}
                                    onChange={(e) => updateField('twitterHandle', e.target.value)}
                                    placeholder="@xtremenano_sa"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>الحد الأقصى للروابط الداخلية لكل مقال</label>
                                <input
                                    type="number"
                                    value={config.maxInternalLinksPerPost}
                                    onChange={(e) => updateField('maxInternalLinksPerPost', parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={20}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>عدد الكلمات المفتاحية الافتراضي</label>
                                <input
                                    type="number"
                                    value={config.defaultMetaKeywordsCount}
                                    onChange={(e) => updateField('defaultMetaKeywordsCount', parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={20}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Default OG Image */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>صورة المشاركة الافتراضية</h2>
                        <div className={styles.formGroup}>
                            <label>رابط صورة Open Graph الافتراضية</label>
                            <input
                                type="text"
                                value={config.defaultOGImage}
                                onChange={(e) => updateField('defaultOGImage', e.target.value)}
                                placeholder="/og-image.png"
                            />
                            {config.defaultOGImage && (
                                <div className={styles.imagePreview}>
                                    <img
                                        src={config.defaultOGImage.startsWith('/api/images/')
                                            ? config.defaultOGImage
                                            : config.defaultOGImage.startsWith('/')
                                                ? config.defaultOGImage
                                                : `/api/images/${config.defaultOGImage}`
                                        }
                                        alt="OG Preview"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
