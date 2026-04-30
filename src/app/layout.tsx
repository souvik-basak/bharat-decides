import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import ChatAssistant from "@/components/ChatAssistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Bharat Decides | Voter Guide",
  description: "A simple and clear guide to help every citizen understand how to vote in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground flex flex-col relative`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
          {/* Solid minimal background */}
          <div className="fixed inset-0 z-[-1] bg-background transition-colors duration-500" />
          
          <Navbar />
          <main className="flex-1 relative z-0">
            {children}
            <ChatAssistant />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
