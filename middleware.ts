import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // No authentication middleware - allow all requests
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
