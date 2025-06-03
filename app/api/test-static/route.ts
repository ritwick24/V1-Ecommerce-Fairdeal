import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads")

    console.log("Checking uploads directory:", uploadsDir)
    console.log("Directory exists:", existsSync(uploadsDir))

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        error: "Uploads directory does not exist",
        path: uploadsDir,
        cwd: process.cwd(),
      })
    }

    const files = await readdir(uploadsDir)
    console.log("Files in uploads directory:", files)

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = join(uploadsDir, file)
        const stats = await stat(filePath)
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          url: `/uploads/${file}`,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      uploadsDir,
      files: fileDetails,
      count: files.length,
    })
  } catch (error) {
    console.error("Error checking uploads:", error)
    return NextResponse.json({
      error: "Failed to check uploads directory",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
