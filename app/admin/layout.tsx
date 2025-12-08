export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl">
            <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', 'Tajawal', sans-serif" }}>
                {children}
            </body>
        </html>
    );
}
