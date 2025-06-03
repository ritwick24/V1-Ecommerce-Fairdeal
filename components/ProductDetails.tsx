"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCart } from "@/hooks/useCart"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  images: string[]
  stock: number
  category_name: string
  prices: Array<{
    min_quantity: number
    max_quantity: number | null
    price: number
  }>
}

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const getCurrentPrice = (qty: number) => {
    const priceRange = product.prices.find(
      (p) => qty >= p.min_quantity && (p.max_quantity === null || qty <= p.max_quantity),
    )
    return priceRange?.price || product.prices[0]?.price || 0
  }

  const currentPrice = getCurrentPrice(quantity)
  const totalPrice = currentPrice * quantity

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
          {product.images.length > 0 ? (
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl opacity-50">📦</span>
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  selectedImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <Badge variant="outline" className="mb-4">
            {product.category_name}
          </Badge>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <Badge variant="default" className="bg-green-100 text-green-800">
                In Stock
              </Badge>
              <span className="text-sm text-gray-600">{product.stock} units available</span>
            </>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Pricing Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantity Range</TableHead>
                  <TableHead>Price per Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.prices.map((priceRange, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {priceRange.min_quantity}
                      {priceRange.max_quantity ? ` - ${priceRange.max_quantity}` : "+"}
                    </TableCell>
                    <TableCell className="font-semibold">₹{priceRange.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quantity Selector and Add to Cart */}
        {product.stock > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      min={1}
                      max={product.stock}
                      className="w-24 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Price per unit:</span>
                    <span className="font-semibold">₹{currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
