import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/hooks/useCart"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DatabaseStatus from "@/components/DatabaseStatus"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wholesale Electronics Hub - Bulk Electronics for Retailers",
  description:
    "Premium electronics at wholesale prices for retailers. Bulk pricing, WhatsApp checkout, and fast delivery.",
  keywords: "wholesale electronics, bulk electronics, retailer electronics, mobile phones wholesale, laptops bulk",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <DatabaseStatus />
        </CartProvider>
      </body>
    </html>
  )
}
