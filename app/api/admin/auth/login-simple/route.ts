import { type NextRequest, NextResponse } from "next/server"

// Alternative login endpoint with simpler cookie handling
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const validUser = process.env.ADMIN_USER || "admin"
    const validPassword = process.env.ADMIN_PASS || "password"

    console.log("=== SIMPLE LOGIN ===")
    console.log("Credentials match:", username === validUser && password === validPassword)

    if (username === validUser && password === validPassword) {
      const sessionToken = Buffer.from(
        JSON.stringify({
          username,
          timestamp: Date.now(),
        }),
      ).toString("base64")

      console.log("Token created:", sessionToken.substring(0, 20) + "...")

      // Create response with explicit headers
      const response = new NextResponse(
        JSON.stringify({
          success: true,
          message: "Login successful",
          token: sessionToken, // Send token in response for client-side setting
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `admin_auth=${sessionToken}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax; HttpOnly`,
          },
        },
      )

      console.log("Response created with Set-Cookie header")
      return response
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Simple login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
