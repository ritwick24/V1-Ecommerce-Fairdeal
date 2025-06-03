import { NextResponse } from "next/server"

// Manual cookie setting endpoint for testing
export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    console.log("Setting cookie manually with token:", token.substring(0, 20) + "...")

    const response = NextResponse.json({
      success: true,
      message: "Cookie set manually",
    })

    // Set cookie with explicit configuration
    const cookieString = `admin_auth=${token}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax; HttpOnly`

    response.headers.set("Set-Cookie", cookieString)

    console.log("Manual cookie string:", cookieString)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    return response
  } catch (error) {
    console.error("Manual cookie setting error:", error)
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 })
  }
}
