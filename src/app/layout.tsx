import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
  description: "Architectural excellence in trading bot automation and brokerage web infrastructure for the Deriv ecosystem and professional traders.",
  metadataBase: new URL("https://mesoflix.systems"), // Replace with actual production URL
  openGraph: {
    title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
    description: "Architectural excellence in trading bot automation and brokerage web infrastructure.",
    url: "https://mesoflix.systems",
    siteName: "Mesoflix Systems",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mesoflix Systems Social Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesoflix Systems | Enterprise Deriv Site Ecosystems",
    description: "Architectural excellence in trading bot automation and brokerage web infrastructure.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
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
