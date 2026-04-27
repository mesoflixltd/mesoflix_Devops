import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
  description: "Architectural excellence in trading bot automation and brokerage web infrastructure for the Deriv ecosystem and professional traders.",
  metadataBase: new URL("https://tradermind.site"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mesoflix DevOps",
  },
  openGraph: {
    title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
    description: "Architectural excellence in trading bot automation and brokerage web infrastructure.",
    url: "https://tradermind.site",
    siteName: "Mesoflix Systems",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 800,
        alt: "Mesoflix Systems Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
    description: "Architectural excellence in trading bot automation and brokerage web infrastructure.",
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
