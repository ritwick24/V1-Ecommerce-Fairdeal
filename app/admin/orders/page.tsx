"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Order {
  id: number
  products: any[]
  quantities: any[]
  total_price: number
  user_contact?: string
  user_name?: string
  user_email?: string
  user_address?: string
  notes?: string
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Order ID", "Customer Name", "Contact", "Email", "Total Amount", "Products", "Date"].join(","),
      ...orders.map((order) =>
        [
          order.id,
          order.user_name || "N/A",
          order.user_contact || "N/A",
          order.user_email || "N/A",
          order.total_price,
          order.products.map((p) => p.name).join("; "),
          new Date(order.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Logs</h1>
          <p className="text-gray-600">WhatsApp orders and customer inquiries</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Badge variant="outline">#{order.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user_name || "N/A"}</p>
                        {order.user_email && <p className="text-sm text-gray-500">{order.user_email}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{order.user_contact || "N/A"}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {order.products.map((product, index) => (
                          <div key={index} className="text-sm">
                            {product.name} (x{order.quantities[index]})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{order.total_price.toLocaleString()}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
