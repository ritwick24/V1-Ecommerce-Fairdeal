"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Package, BarChart3, ShoppingCart, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const handleLogout = () => {
    window.location.href = "/admin/login"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/admin/dashboard"
                className={`flex items-center space-x-1 transition-colors ${
                  pathname === "/admin/dashboard" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/categories"
                className={`flex items-center space-x-1 transition-colors ${
                  pathname.startsWith("/admin/categories") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Categories</span>
              </Link>
              <Link
                href="/admin/products"
                className={`flex items-center space-x-1 transition-colors ${
                  pathname.startsWith("/admin/products") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>
              <Link
                href="/admin/orders"
                className={`flex items-center space-x-1 transition-colors ${
                  pathname.startsWith("/admin/orders") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main>{children}</main>
    </div>
  )
}
