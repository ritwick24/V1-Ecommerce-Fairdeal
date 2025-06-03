export interface AdminSession {
  isAuthenticated: boolean
  username?: string
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USER || "admin"
  const validPassword = process.env.ADMIN_PASS || "password"
  return username === validUser && password === validPassword
}

export function createSessionToken(username: string): string {
  const sessionData = {
    username,
    timestamp: Date.now(),
  }
  return Buffer.from(JSON.stringify(sessionData)).toString("base64")
}

export function verifySessionToken(token: string): AdminSession {
  try {
    const sessionData = JSON.parse(Buffer.from(token, "base64").toString())
    const isValid = Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000 // 24 hours

    if (isValid && sessionData.username) {
      return {
        isAuthenticated: true,
        username: sessionData.username,
      }
    }
  } catch (error) {
    console.error("Invalid session token:", error)
  }

  return { isAuthenticated: false }
}
