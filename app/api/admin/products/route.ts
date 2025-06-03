import { NextResponse } from "next/server"
import { getAllProducts, createProduct, updateProductPrices } from "@/lib/db"

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, images, category_ids, stock, prices } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const product = await createProduct({
      name,
      slug,
      description: description || "",
      images: images || [],
      stock: Number.parseInt(stock) || 0,
      category_ids: category_ids || [],
    })

    // Add pricing tiers if provided
    if (prices && prices.length > 0) {
      await updateProductPrices(product.id, prices)
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
