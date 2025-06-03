import { NextResponse } from "next/server"
import { getCategoryBySlug } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const data = await getCategoryBySlug(slug)

    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
