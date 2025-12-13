'use client';

import { useEffect, useState } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const auth = localStorage.getItem('admin_authenticated');
            if (auth === 'true') {
                setIsAuthenticated(true);
            } else {
                window.location.href = '/admin/login';
            }
        }
    }, []);

    if (!mounted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>جاري التحميل...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>جاري إعادة التوجيه...</div>
            </div>
        );
    }

    return <>{children}</>;
}




