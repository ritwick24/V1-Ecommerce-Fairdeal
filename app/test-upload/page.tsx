"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setMessage("")

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first")
      return
    }

    setUploading(true)
    setMessage("Uploading...")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      console.log("Uploading file:", selectedFile.name)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)
      const result = await response.json()
      console.log("Response data:", result)

      if (response.ok) {
        setUploadedImageUrl(result.imageUrl)
        setMessage("Upload successful!")
        console.log("Uploaded image URL:", result.imageUrl)
      } else {
        setMessage(`Upload failed: ${result.error}`)
        console.error("Upload error:", result)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setMessage("Upload failed: Network error")
    } finally {
      setUploading(false)
    }
  }

  const testImageAccess = () => {
    if (uploadedImageUrl) {
      // Test if the image is accessible
      const img = new window.Image()
      img.onload = () => {
        console.log("Image loaded successfully:", uploadedImageUrl)
        setMessage("Image is accessible!")
      }
      img.onerror = () => {
        console.error("Image failed to load:", uploadedImageUrl)
        setMessage("Image is not accessible!")
      }
      img.src = uploadedImageUrl
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Select Image</Label>
            <Input id="file" type="file" accept="image/*" onChange={handleFileSelect} />
          </div>

          {selectedFile && (
            <div>
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
              </p>
              <p className="text-xs text-gray-500">Type: {selectedFile.type}</p>
            </div>
          )}

          {previewUrl && (
            <div className="space-y-2">
              <Label>File Preview:</Label>
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image src={previewUrl || "/placeholder.svg"} alt="File preview" fill className="object-cover" />
              </div>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>

          {message && (
            <div
              className={`text-sm p-2 rounded ${
                message.includes("successful") || message.includes("accessible")
                  ? "text-green-600 bg-green-50"
                  : message.includes("failed") || message.includes("not accessible")
                    ? "text-red-600 bg-red-50"
                    : "text-blue-600 bg-blue-50"
              }`}
            >
              {message}
            </div>
          )}

          {uploadedImageUrl && (
            <div className="space-y-2">
              <Label>Uploaded Image:</Label>
              <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={uploadedImageUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  onLoad={() => console.log("Next.js Image loaded successfully")}
                  onError={(e) => {
                    console.error("Next.js Image failed to load:", e)
                    setMessage("Image failed to load in Next.js Image component")
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 break-all">URL: {uploadedImageUrl}</p>

              <div className="flex gap-2">
                <Button onClick={testImageAccess} variant="outline" size="sm">
                  Test Image Access
                </Button>
                <Button onClick={() => window.open(uploadedImageUrl, "_blank")} variant="outline" size="sm">
                  Open in New Tab
                </Button>
              </div>

              {/* Fallback img tag for testing */}
              <div className="space-y-2">
                <Label>Fallback img tag test:</Label>
                <img
                  src={uploadedImageUrl || "/placeholder.svg"}
                  alt="Fallback test"
                  className="w-full h-32 object-cover border rounded"
                  onLoad={() => console.log("Regular img tag loaded successfully")}
                  onError={() => console.error("Regular img tag failed to load")}
                />
              </div>
            </div>
          )}

          {/* Debug info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Current URL: {window.location.origin}</p>
            <p>Expected upload path: {window.location.origin}/uploads/[filename]</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
