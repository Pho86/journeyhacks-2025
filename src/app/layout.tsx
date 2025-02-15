import type { Metadata } from "next";
import { Rubik, Rubik_Mono_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context";
const rubik_sans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

const rubik_mono = Rubik_Mono_One({
  weight: "400",
  variable: "--font-rubik-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Sensitivity",
  description: "A tool to help you understand your food sensitivities by analyzing images of your food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik_sans.variable} flex justify-center mb-32 min-h-[50dvh] ${rubik_mono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
