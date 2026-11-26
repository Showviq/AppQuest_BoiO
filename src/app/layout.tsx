import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Tiro_Bangla } from "next/font/google";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const ui = Hind_Siliguri({
  variable: "--font-ui",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const book = Tiro_Bangla({
  variable: "--font-book",
  subsets: ["bengali", "latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Boi-O",
  description: "Track, rate and discover Bangla and English books.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eedd" },
    { media: "(prefers-color-scheme: dark)", color: "#131814" },
  ],
};

// Applies the saved theme before paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("boio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${ui.variable} ${book.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
