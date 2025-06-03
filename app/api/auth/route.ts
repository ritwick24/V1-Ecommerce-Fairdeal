import type { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  })
}
