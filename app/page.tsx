import { Suspense } from "react"
import CategoryGrid from "@/components/CategoryGrid"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Wholesale Electronics Hub</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Premium electronics at wholesale prices for retailers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Bulk Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>WhatsApp Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of electronics organized by category. Find the perfect products for your
              retail business.
            </p>
          </div>

          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid />
          </Suspense>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button size="lg" variant="outline">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tiered Pricing</h3>
              <p className="text-gray-600">Better prices for larger quantities. Save more when you buy more.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Checkout</h3>
              <p className="text-gray-600">Simple and secure checkout process through WhatsApp messaging.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to help you stock your store faster.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
