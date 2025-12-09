import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "اكستريم نانو XTREME NANO | أفضل مركز حماية سيارات بالرياض (خصم 20%)",
  description:
    "اكستريم نانو بالرياض يقدم أفضل خدمات حماية السيارات، حماية الطلاء PPF، النانو سيراميك، تظليل حراري، تلميع داخلي وخارجي بتنفيذ احترافي وخبرة عالية. احجز الآن واحصل على خصم 20%. رقم التواصل: 966570044578",
  metadataBase: new URL("https://www.xtreme-nano.com/"),
  openGraph: {
    title:
      "اكستريم نانو XTREME NANO | أفضل مركز حماية سيارات بالرياض (خصم 20%)",
    description:
      "خدمات حماية السيارات بالرياض – نانو سيراميك، تظليل حراري، حماية الطلاء PPF، تلميع داخلي وخارجي بجودة عالية. خصم 20% الآن مع اكستريم نانو.",
    url: "https://www.xtreme-nano.com/",
    siteName: "اكستريم نانو XTREME NANO",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "اكستريم نانو – خدمات حماية السيارات بالرياض",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "اكستريم نانو XTREME NANO | أفضل مركز حماية سيارات بالرياض (خصم 20%)",
    description:
      "حماية الطلاء – PPF – نانو سيراميك – تظليل حراري – تلميع – حماية داخلية وخارجية بالرياض. خصم 20% الآن.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* كلمات مفتاحية للسيو */}
        <meta
          name="keywords"
          content="اكستريم نانو, اكستريم نانو الرياض, مركز اكستريم نانو, افضل مركز حماية سيارات بالرياض, حماية الطلاء بالرياض, حماية السيارات بالرياض, حماية السيارة PPF, حماية الفلمين PPF الرياض, حماية اكسبيل الرياض, حماية البودي بالرياض, نانو سيراميك بالرياض, افضل نانو سيراميك بالرياض, اسعار النانو سيراميك بالرياض, تظليل حراري بالرياض, تظليل السيارات بالرياض, افضل تظليل بالرياض, عزل حراري للسيارات بالرياض, تفييم سيارات الرياض, تغليف سيارات, تلميع السيارات بالرياض, تلميع داخلي وخارجي, تلميع نانو, تنظيف مقاعد السيارة, تنظيف المراتب, خدمات عناية سيارات بالرياض, صيانة سيارات فاخرة بالرياض, افضل مركز تلميع سيارات, حماية الزجاج, حماية المصابيح, اصلاح خدوش السيارات, معالجة خدوش البودي, تعديل الخدوش, تلميع زجاج السيارات, حماية داخلية, حماية خارجية, افضل ورشة حماية سيارات بالرياض, عروض حماية السيارات, تركيب حماية الطلاء, زينة السيارات, خدمات فاخرة للسيارات, مراكز العناية بالسيارات الرياض, مركز حماية سيارات موثوق بالرياض"
        />
        <meta name="author" content="اكستريم نانو XTREME NANO" />
        <meta name="telephone" content="966570044578" />
      </head>

      <body>
        {/* GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WXHT775S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}

        {/* ====== 🟢 أزرار واتساب + اتصال على اليمين ====== */}
        <div className="floating-buttons">
          {/* زر واتساب SVG رسمي */}
          <a
            href="https://wa.me/966570044578"
            target="_blank"
            className="whatsapp-icon"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="32" height="32">
              <path
                fill="#25d366"
                d="M16.027 3c-7.167 0-13 5.832-13 13 0 2.289.6 4.533 1.734 6.507L3 29l6.667-1.733c1.906.96 4.053 1.467 6.36 1.467h.007c7.167 0 13-5.833 13-13 0-3.466-1.36-6.72-3.827-9.173C22.747 4.36 19.493 3 16.027 3zm7.613 18.56c-.333.94-1.947 1.786-2.693 1.893-.747.107-1.693.147-2.733-.173-.627-.2-1.426-.467-2.44-.913-4.293-1.853-7.093-6.187-7.307-6.48-.213-.293-1.747-2.32-1.747-4.427s1.107-3.147 1.493-3.573c.387-.427.853-.533 1.147-.533.293 0 .587 0 .84.013.267.013.627-.107.98.747.333.8 1.133 2.773 1.233 2.947.093.173.153.387.027.627-.133.293-.2.387-.387.6-.2.227-.413.507-.587.68-.2.2-.413.427-.18.84.227.387 1.013 1.667 2.173 2.707 1.493 1.32 2.747 1.733 3.16 1.92.413.187.653.16.893-.093.24-.253 1.04-1.213 1.32-1.627.28-.413.56-.347.94-.2s2.453 1.16 2.867 1.373c.413.213.693.32.793.493.093.173.093 1 .093 1.067 0 .067-.027.493-.36 1.433z"
              />
            </svg>
          </a>

          {/* زر الاتصال */}
          <a href="tel:966570044578" className="call-btn" aria-label="Call">
            📞
          </a>
        </div>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WXHT775S');
          `}
        </Script>

        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17479045303"
          strategy="afterInteractive"
        />
        <Script id="google-ads-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17479045303');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7RJBGN75HZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7RJBGN75HZ');
          `}
        </Script>

        {/* JSON-LD Schema */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              "name": "اكستريم نانو XTREME NANO",
              "url": "https://www.xtreme-nano.com/",
              "logo": "https://www.xtreme-nano.com/android-chrome-512x512.png",
              "image": "https://www.xtreme-nano.com/android-chrome-512x512.png",
              "description": "أفضل مركز حماية سيارات بالرياض – حماية الطلاء، نانو سيراميك، تظليل حراري، تلميع داخلي وخارجي.",
              "telephone": "+966570044578",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "الرياض",
                "addressCountry": "SA"
              },
              "areaServed": ["الرياض", "السعودية"],
              "sameAs": [
                "https://x.com/xtremenano_sa",
                "https://www.instagram.com/xtremenano_sa/",
                "https://www.tiktok.com/@xtremenano_sa"
              ],
              "serviceType": [
                "حماية الطلاء PPF",
                "النانو سيراميك",
                "تظليل حراري",
                "تلميع داخلي",
                "تلميع خارجي",
                "تنظيف المراتب",
                "تغيير شكل السيارة"
              ]
            }
          `}
        </Script>
      </body>
    </html>
  );
}
