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

// Applies the saved theme and accessibility prefs before paint to avoid a flash.
// Keys must match components/settings/a11y.ts.
const themeScript = `try{var d=document.documentElement.dataset,t=localStorage.getItem("boio-theme");if(t==="light"||t==="dark")d.theme=t;var a=JSON.parse(localStorage.getItem("boio-a11y")||"{}");if(a.font)d.font="dyslexic";if(a.contrast)d.contrast="high";if(a.text&&a.text!=="md")d.text=a.text;if(a.motion)d.motion="reduce"}catch(e){}`;

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
