import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called")

    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      console.log("No file in request")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Please upload JPG, PNG, or WEBP" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size)
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const filename = `${timestamp}-${randomStr}.${fileExtension}`

    console.log("Generated filename:", filename)

    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads")
    console.log("Uploads directory:", uploadsDir)

    if (!existsSync(uploadsDir)) {
      console.log("Creating uploads directory")
      await mkdir(uploadsDir, { recursive: true })
    }

    const filePath = join(uploadsDir, filename)
    console.log("Full file path:", filePath)

    // Write the file
    await writeFile(filePath, buffer)
    console.log("File written successfully")

    // Return the public URL (this will be accessible via /uploads/filename)
    const imageUrl = `/uploads/${filename}`
    console.log("Image URL:", imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl,
      filename,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
