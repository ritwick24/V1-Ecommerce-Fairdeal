"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface PriceTier {
  min_quantity: number
  max_quantity: number | null
  price: number
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_ids: [] as number[],
    stock: 0,
    images: [] as string[],
  })
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([{ min_quantity: 1, max_quantity: 5, price: 0 }])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Find the generateSlug function and update it to include a check for uniqueness
  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Add a short random string to help ensure uniqueness
    const randomStr = Math.random().toString(36).substring(2, 6)
    return `${baseSlug}-${randomStr}`
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        category_ids: [...formData.category_ids, categoryId],
      })
    } else {
      setFormData({
        ...formData,
        category_ids: formData.category_ids.filter((id) => id !== categoryId),
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPG, PNG, WEBP)")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)

      // Upload file to server
      try {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (response.ok) {
          const result = await response.json()
          console.log("Upload result:", result)
          // Add the uploaded image URL to the images array
          setFormData({
            ...formData,
            images: [...formData.images, result.imageUrl],
          })
        } else {
          const error = await response.json()
          console.error("Upload error:", error)
          alert("Failed to upload image: " + (error.error || "Unknown error"))
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Failed to upload image")
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    if (index === 0) setImagePreview("")
  }

  const addPriceTier = () => {
    const lastTier = priceTiers[priceTiers.length - 1]
    const newMinQuantity = lastTier.max_quantity ? lastTier.max_quantity + 1 : lastTier.min_quantity + 10
    setPriceTiers([
      ...priceTiers,
      {
        min_quantity: newMinQuantity,
        max_quantity: newMinQuantity + 9,
        price: 0,
      },
    ])
  }

  const updatePriceTier = (index: number, field: keyof PriceTier, value: number | null) => {
    const newTiers = [...priceTiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setPriceTiers(newTiers)
  }

  const removePriceTier = (index: number) => {
    if (priceTiers.length > 1) {
      setPriceTiers(priceTiers.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || formData.category_ids.length === 0) {
        alert("Please fill in all required fields and select at least one category")
        return
      }

      // Validate price tiers
      const validPriceTiers = priceTiers.filter((tier) => tier.price > 0)
      if (validPriceTiers.length === 0) {
        alert("Please add at least one price tier")
        return
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prices: validPriceTiers,
        }),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your wholesale catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., iPhone 15 Pro"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., iphone-15-pro"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">This will be used in the URL: /product/{formData.slug}</p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed product description..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Categories *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={formData.category_ids.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.category_ids.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">Please select at least one category</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pricing Tiers
                  <Button type="button" onClick={addPriceTier} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceTiers.map((tier, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>Min Quantity</Label>
                      <Input
                        type="number"
                        value={tier.min_quantity}
                        onChange={(e) => updatePriceTier(index, "min_quantity", Number.parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Max Quantity</Label>
                      <Input
                        type="number"
                        value={tier.max_quantity || ""}
                        onChange={(e) =>
                          updatePriceTier(
                            index,
                            "max_quantity",
                            e.target.value ? Number.parseInt(e.target.value) : null,
                          )
                        }
                        placeholder="Unlimited"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={tier.price}
                        onChange={(e) => updatePriceTier(index, "price", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {priceTiers.length > 1 && (
                      <Button type="button" onClick={() => removePriceTier(index)} variant="outline" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Upload Images</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => removeImage(0)}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Uploaded Images List */}
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Images ({formData.images.length})</Label>
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm truncate">Image {index + 1}</span>
                          <Button type="button" onClick={() => removeImage(index)} variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating Product..." : "Create Product"}
                  </Button>
                  <Link href="/admin/products">
                    <Button variant="outline" type="button" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
