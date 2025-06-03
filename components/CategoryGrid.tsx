import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
  id: number
  name: string
  slug: string
  image?: string
  product_count?: number
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

export default async function CategoryGrid() {
  const categories = await getCategories()
  const displayCategories = categories.slice(0, 6)

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No categories available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCategories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
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
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                {category.product_count !== undefined && (
                  <p className="text-sm text-gray-500">{category.product_count} products</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
