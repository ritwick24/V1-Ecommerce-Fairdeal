import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This is for debugging only - remove in production
    const adminUser = process.env.ADMIN_USER || "admin"
    const adminPass = process.env.ADMIN_PASS || "password"

    console.log("=== ENV DEBUG ===")
    console.log("NODE_ENV:", process.env.NODE_ENV)
    console.log("ADMIN_USER from env:", process.env.ADMIN_USER)
    console.log("ADMIN_PASS from env:", process.env.ADMIN_PASS)
    console.log("Final username:", adminUser)
    console.log("Final password:", adminPass)
    console.log("================")

    return NextResponse.json({
      username: adminUser,
      password: adminPass,
      hasEnvUser: !!process.env.ADMIN_USER,
      hasEnvPass: !!process.env.ADMIN_PASS,
    })
  } catch (error) {
    console.error("Env debug error:", error)
    return NextResponse.json({ error: "Failed to get env info" }, { status: 500 })
  }
}
