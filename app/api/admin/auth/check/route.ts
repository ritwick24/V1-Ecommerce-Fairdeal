import { NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
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

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = verifySessionToken(sessionToken)

    if (session.isAuthenticated) {
      return NextResponse.json({
        authenticated: true,
        username: session.username,
      })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
