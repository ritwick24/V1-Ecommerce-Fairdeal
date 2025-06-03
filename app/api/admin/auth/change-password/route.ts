import { NextResponse } from "next/server"
import { verifySessionToken, validateAdminCredentials } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const cookieHeader = request.headers.get("cookie")
    let sessionToken = null

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )
      sessionToken = cookies["admin_auth"]
    }

    if (!sessionToken || !verifySessionToken(sessionToken).isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { oldPassword, newPassword, confirmPassword } = await request.json()

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate old password
    const currentUser = process.env.ADMIN_USER || "admin"
    if (!validateAdminCredentials(currentUser, oldPassword)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // In development, update .env file
    if (process.env.NODE_ENV === "development") {
      try {
        const envPath = join(process.cwd(), ".env.local")
        const envContent = `# Updated by admin password change
ADMIN_USER="${currentUser}"
ADMIN_PASS="${newPassword}"

# Add your other environment variables here
DATABASE_URL="${process.env.DATABASE_URL || ""}"
NEXT_PUBLIC_BASE_URL="${process.env.NEXT_PUBLIC_BASE_URL || ""}"
NEXT_PUBLIC_WHATSAPP_NUMBER="${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}"
`
        await writeFile(envPath, envContent)

        return NextResponse.json({
          success: true,
          message: "Password updated successfully. Please restart the server for changes to take effect.",
        })
      } catch (error) {
        console.error("Error updating .env file:", error)
        return NextResponse.json(
          {
            error: "Failed to update password. Please update manually in .env file.",
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json(
        {
          error: "Password change not supported in production. Please update through your deployment configuration.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
