"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/useCart"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const generateWhatsAppMessage = () => {
    const orderDetails = state.items
      .map((item) => `• ${item.name} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`)
      .join("\n")

    const message = `🛒 *New Wholesale Order*

*Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}
Address: ${customerInfo.address}

*Order Details:*
${orderDetails}

*Total Amount: ₹${state.total.toLocaleString()}*

${customerInfo.notes ? `*Additional Notes:*\n${customerInfo.notes}` : ""}

Please confirm this order and provide delivery details.`

    return encodeURIComponent(message)
  }

  const handleWhatsAppCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Please fill in your name and phone number")
      return
    }

    try {
      // Log order to database
      await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: state.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
          })),
          quantities: state.items.map((item) => item.quantity),
          total_price: state.total,
          user_contact: customerInfo.phone,
          user_name: customerInfo.name,
          user_email: customerInfo.email,
          user_address: customerInfo.address,
          notes: customerInfo.notes,
        }),
      })

      const message = generateWhatsAppMessage()
      const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${message}`
      window.open(whatsappUrl, "_blank")

      // Clear cart after successful checkout
      clearCart()
    } catch (error) {
      console.error("Error logging order:", error)
      // Still proceed with WhatsApp even if logging fails
      const message = generateWhatsAppMessage()
      const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${message}`
      window.open(whatsappUrl, "_blank")
      clearCart()
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} per unit</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>₹{state.total.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{state.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Your delivery address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requirements or notes"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button onClick={handleWhatsAppCheckout} className="w-full bg-green-600 hover:bg-green-700" size="lg">
              <span className="mr-2">📱</span>
              Checkout via WhatsApp
            </Button>

            <p className="text-sm text-gray-600 text-center">You'll be redirected to WhatsApp to complete your order</p>
          </div>
        </div>
      </div>
    </div>
  )
}
