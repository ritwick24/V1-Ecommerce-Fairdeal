import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  images: string[]
  stock: number
  min_price: number
  slug: string
}

interface Category {
  id: number
  name: string
  slug: string
}

async function getCategoryWithProducts(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/categories/${slug}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getCategoryWithProducts(params.slug)

  if (!data) {
    notFound()
  }

  const { category, products } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600">{products.length} products available</p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-48 bg-gray-100">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-4xl opacity-50">📦</span>
                        </div>
                      )}
                      {product.stock <= 10 && product.stock > 0 && (
                        <Badge variant="destructive" className="absolute top-2 right-2">
                          Low Stock
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Starting from</p>
                          <p className="text-lg font-bold text-green-600">₹{product.min_price.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">{product.stock} in stock</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
