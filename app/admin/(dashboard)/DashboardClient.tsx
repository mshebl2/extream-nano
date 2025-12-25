'use client';

import Link from 'next/link';
import { Briefcase, ImageIcon, FileText, TrendingUp, Settings, Link2 } from 'lucide-react';
import styles from './overview.module.css';

interface DashboardClientProps {
    stats: {
        servicesCount: number;
        blogsCount: number;
    };
}

export default function DashboardClient({ stats }: DashboardClientProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>لوحة التحكم</h1>
                    <p className={styles.subtitle}>مرحباً بك في لوحة تحكم XTREME NANO</p>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card} style={{ animationDelay: '0.1s' }}>
                    <div className={styles.cardIcon}>
                        <Briefcase size={28} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardTitle}>إجمالي الخدمات</span>
                        <span className={styles.cardValue}>{stats.servicesCount}</span>
                    </div>
                </div>
                <div className={styles.card} style={{ animationDelay: '0.2s' }}>
                    <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #e9cb1d 0%, #c9a617 100%)' }}>
                        <FileText size={28} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardTitle}>مقالات المدونة</span>
                        <span className={styles.cardValue}>{stats.blogsCount}</span>
                    </div>
                </div>
                <div className={styles.card} style={{ animationDelay: '0.3s' }}>
                    <div className={styles.cardIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <TrendingUp size={28} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardTitle}>الحجوزات الجديدة</span>
                        <span className={styles.cardValue}>--</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>إدارة سريعة</h2>
                <div className={styles.actions}>
                    <Link href="/admin/services" className={styles.actionCard}>
                        <Briefcase className={styles.actionIcon} />
                        <div className={styles.actionContent}>
                            <span className={styles.actionTitle}>إدارة الخدمات</span>
                            <span className={styles.actionDescription}>إضافة وتعديل خدمات التلميع والحماية</span>
                        </div>
                    </Link>
                    <Link href="/admin/blogs" className={styles.actionCard}>
                        <FileText className={styles.actionIcon} />
                        <div className={styles.actionContent}>
                            <span className={styles.actionTitle}>إدارة المدونة</span>
                            <span className={styles.actionDescription}>إضافة وتعديل مقالات المدونة</span>
                        </div>
                    </Link>
                    <Link href="/admin/site-images" className={styles.actionCard}>
                        <ImageIcon className={styles.actionIcon} />
                        <div className={styles.actionContent}>
                            <span className={styles.actionTitle}>صور الموقع</span>
                            <span className={styles.actionDescription}>تحديث صور الصفحة الرئيسية والأقسام</span>
                        </div>
                    </Link>
                    <Link href="/admin/seo-config" className={styles.actionCard}>
                        <Settings className={styles.actionIcon} />
                        <div className={styles.actionContent}>
                            <span className={styles.actionTitle}>إعدادات SEO</span>
                            <span className={styles.actionDescription}>تحسين محركات البحث والإعدادات العامة</span>
                        </div>
                    </Link>
                    <Link href="/admin/link-mappings" className={styles.actionCard}>
                        <Link2 className={styles.actionIcon} />
                        <div className={styles.actionContent}>
                            <span className={styles.actionTitle}>الروابط الداخلية</span>
                            <span className={styles.actionDescription}>إدارة الكلمات المفتاحية والروابط التلقائية</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

