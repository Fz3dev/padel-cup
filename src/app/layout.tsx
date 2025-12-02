import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Stoneo Padel Cup",
    description: "Tournoi de Padel Stoneo x AVEST - 03 Décembre 2025",
    manifest: "/manifest.json",
    themeColor: "#0A1128",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
            <body className="bg-stoneo-900 min-h-screen text-white pb-20">
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: '#141E3C',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                        },
                    }}
                />
            </body>
        </html>
    );
}
