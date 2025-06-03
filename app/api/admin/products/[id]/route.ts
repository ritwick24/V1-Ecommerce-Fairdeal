import { NextResponse } from "next/server"
import { updateProduct, deleteProduct, updateProductPrices } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { name, slug, description, images, category_ids, stock, prices } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const product = await updateProduct(id, {
      name,
      slug,
      description: description || "",
      images: images || [],
      stock: Number.parseInt(stock) || 0,
      category_ids: category_ids || [],
    })

    // Update pricing tiers if provided
    if (prices && prices.length > 0) {
      await updateProductPrices(id, prices)
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
