import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dashlabs Healthcare Data Science Showcase",
    template: "%s | Dashlabs Portfolio",
  },
  description:
    "How anonymized healthcare data becomes analytics and machine learning solutions. Built by the Dashlabs.ai Data Science team.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dashlabs Healthcare DS Showcase",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white antialiased">
