import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/ui/Preloader";
import JsonLd from "@/components/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://e-ventura.com"),
  title: {
    default: "Eventura | Luxury Event Management & Wedding Planner in Jodhpur, Rajasthan",
    template: "%s | Eventura Luxury Events",
  },
  description:
    "Eventura is the premier luxury event management company and destination wedding planner in Jodhpur, Rajasthan. Specializing in royal weddings, corporate galas, and bespoke cultural celebrations.",
  keywords: [
    "Luxury Event Management Company",
    "Event Management Company India",
    "Wedding Planner India",
    "Wedding Planner Rajasthan",
    "Wedding Planner Jodhpur",
    "Destination Wedding Planner",
    "Destination Wedding Rajasthan",
    "Luxury Wedding Planner",
    "Royal Wedding Planner",
    "Corporate Event Management",
    "Corporate Event Planner",
    "Birthday Party Planner",
    "Anniversary Celebration Planner",
    "Engagement Ceremony Planner",
    "Cultural Event Planner",
    "Private Event Planner",
    "Luxury Wedding Decor",
    "Wedding Decoration Services",
    "Destination Wedding Services",
    "Premium Event Organizer",
    "Event Planning Services",
    "Best Event Management Company",
    "Best Wedding Planner",
    "Luxury Event Planner",
    "Indian Wedding Planner",
    "Eventura",
    "Eventura India",
    "Eventura Weddings",
  ],
  authors: [{ name: "Eventura", url: "https://e-ventura.com" }],
  creator: "Eventura",
  publisher: "Eventura",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://e-ventura.com/",
  },
  openGraph: {
    title: "Eventura | Luxury Event Management & Wedding Planner in Jodhpur",
    description:
      "Creating extraordinary experiences that last forever. Premier luxury wedding planners and corporate event managers in Rajasthan.",
    url: "https://e-ventura.com/",
    siteName: "Eventura",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Eventura Luxury Event Planning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventura | Luxury Event Management & Wedding Planner",
    description:
      "Creating extraordinary experiences that last forever. Premier luxury wedding planners in Jodhpur & Rajasthan.",
    images: ["/images/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-[#0B0B0F] text-[#f0f0f0] selection:bg-[#D4AF37]/30 selection:text-white`}
      >
        <Preloader />
        {children}
      </body>
    </html>
  );
}
