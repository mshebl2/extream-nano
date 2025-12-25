'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Briefcase,
    Image as ImageIcon,
    FileText,
    LogOut,
    Menu,
    X,
    Home,
    Settings,
    Link2
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { name: 'لوحة التحكم', path: '/admin', icon: LayoutDashboard },
        { name: 'الخدمات', path: '/admin/services', icon: Briefcase },
        { name: 'المدونة', path: '/admin/blogs', icon: FileText },
        { name: 'صور الموقع', path: '/admin/site-images', icon: ImageIcon },
        { name: 'إعدادات SEO', path: '/admin/seo-config', icon: Settings },
        { name: 'الروابط الداخلية', path: '/admin/link-mappings', icon: Link2 },
    ];

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        router.push('/admin/login');
        window.location.reload();
    };

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                className={styles.mobileToggle}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {isMobileOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}>
                <Link href="/admin" className={styles.logo}>
                    <img src="/logo.png" alt="Logo" className={styles.logoImage} />
                    <span>XTREME NANO</span>
                </Link>
                <nav className={styles.nav}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles.link} ${isActive ? styles.active : ''}`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <Icon className={styles.icon} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className={styles.footerActions}>
                    <Link href="/" className={styles.viewSiteButton}>
                        <Home className={styles.icon} />
                        <span>عرض الموقع</span>
                    </Link>
                    <button onClick={handleLogout} className={styles.logout}>
                        <LogOut className={styles.icon} />
                        تسجيل الخروج
                    </button>
                </div>
            </aside>
        </>
    );
}
