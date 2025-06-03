import { NextResponse } from "next/server"
import { getOrders, logOrder } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const orders = await getOrders(limit, offset)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    const order = await logOrder(orderData)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error logging order:", error)
    return NextResponse.json({ error: "Failed to log order" }, { status: 500 })
  }
}
