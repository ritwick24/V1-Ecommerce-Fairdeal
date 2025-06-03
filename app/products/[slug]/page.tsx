import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductDetails from "@/components/ProductDetails"

interface Product {
  id: number
  name: string
  description: string
  images: string[]
  stock: number
  category_name: string
  category_slug: string
  prices: Array<{
    min_quantity: number
    max_quantity: number | null
    price: number
  }>
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Use direct server import for server components
    const { getProductBySlug } = await import("@/lib/db")
    return getProductBySlug(slug)
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href={`/categories/${product.category_slug}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {product.category_name}
            </Button>
          </Link>
        </div>

        <ProductDetails product={product} />
      </div>
    </div>
  )
}
