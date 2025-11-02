import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idea Validator - اعتبارسنجی ایده با هوش مصنوعی",
  description: "پلتفرم هوشمند اعتبارسنجی ایده‌های کسب‌وکار با تحلیل داده‌های واقعی بازار",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
