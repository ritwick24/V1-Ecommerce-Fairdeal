import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Username:", username)
    console.log("Password length:", password?.length)

    const validUser = process.env.ADMIN_USER || "admin"
    const validPassword = process.env.ADMIN_PASS || "Password@123"

    console.log("Expected username:", validUser)
    console.log("Expected password:", validPassword)
    console.log("Username match:", username === validUser)
    console.log("Password match:", password === validPassword)

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (username === validUser && password === validPassword) {
      // Create session token
      const sessionData = {
        username,
        timestamp: Date.now(),
      }
      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString("base64")

      console.log("Creating session token...")
      console.log("Session data:", sessionData)
      console.log("Token (first 20 chars):", sessionToken.substring(0, 20))

      // Use Next.js cookies() function - this is more reliable
      const cookieStore = await cookies()

      try {
        cookieStore.set("admin_auth", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60, // 24 hours
          path: "/",
        })
        console.log("Cookie set using cookies() function")
      } catch (cookieError) {
        console.error("Error setting cookie with cookies():", cookieError)
      }

      // Create response
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        debug: {
          tokenCreated: true,
          tokenLength: sessionToken.length,
          timestamp: sessionData.timestamp,
        },
      })

      // Also try setting cookie on response object as backup
      try {
        response.cookies.set("admin_auth", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60,
          path: "/",
        })
        console.log("Cookie also set on response object")
      } catch (responseError) {
        console.error("Error setting cookie on response:", responseError)
      }

      // Manual Set-Cookie header as final backup
      const cookieValue = `admin_auth=${sessionToken}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }HttpOnly`

      response.headers.set("Set-Cookie", cookieValue)
      console.log("Manual Set-Cookie header:", cookieValue)

      console.log("Final response headers:", Object.fromEntries(response.headers.entries()))
      console.log("===================")

      return response
    } else {
      console.log("Invalid credentials")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
