import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Category {
  id: number
  name: string
  slug: string
  image?: string
  product_count: number
}

async function getCategories(): Promise<Category[]> {
  try {
    // Use direct server import for server components
    const { getCategories } = await import("@/lib/db")
    return getCategories()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function CategoriesGrid() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📂</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-500">Categories will appear here once they are added.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full">
            <CardContent className="p-0">
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {category.image ? (
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl opacity-50">📱</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {category.product_count} {category.product_count === 1 ? "product" : "products"}
                </p>
                <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">Browse Products →</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of electronics organized by category. Find exactly what you need for your
            retail business.
          </p>
        </div>

        {/* Categories Grid */}
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <CategoriesGrid />
        </Suspense>
      </div>
    </div>
  )
}
