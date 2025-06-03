"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X } from "lucide-react"

export default function NewCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
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

      // Upload file
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
          setFormData({ ...formData, image: result.imageUrl })
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

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/categories")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin/categories">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Category</h1>
        <p className="text-gray-600">Create a new product category for your wholesale catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Mobile Phones"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., mobile-phones"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in the URL: /categories/{formData.slug}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Category"}
                  </Button>
                  <Link href="/admin/categories">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>
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
                      alt="Category preview"
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={removeImage}
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
