"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchDebugInfo = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/auth/env-debug")
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
      } else {
        setError("Failed to fetch debug info")
      }
    } catch (error) {
      console.error("Debug fetch error:", error)
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const checkCookies = () => {
    const cookies = document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
    return {
      allCookies: cookies,
      hasAuthCookie: cookies.some((c) => c.startsWith("admin_auth=")),
      cookieCount: cookies.length,
    }
  }

  const clearAllCookies = () => {
    // Clear all cookies for testing
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    window.location.reload()
  }

  const testAuthCheck = async () => {
    try {
      const response = await fetch("/api/admin/auth/check", {
        credentials: "include",
      })
      const result = await response.json()
      alert(`Auth Check Result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      alert(`Auth Check Error: ${error}`)
    }
  }

  const cookieInfo = checkCookies()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <h3 className="font-semibold mb-2">Environment Variables:</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : debugInfo ? (
            <div className="space-y-2">
              <p>
                <strong>Expected Username:</strong> {debugInfo.username}
              </p>
              <p>
                <strong>Expected Password:</strong> {debugInfo.password}
              </p>
              <p>
                <strong>Has ADMIN_USER env:</strong> {debugInfo.hasEnvUser ? "Yes" : "No"}
              </p>
              <p>
                <strong>Has ADMIN_PASS env:</strong> {debugInfo.hasEnvPass ? "Yes" : "No"}
              </p>
            </div>
          ) : null}
        </div>

        <div className="text-sm">
          <h3 className="font-semibold mb-2">Browser Cookies:</h3>
          <div className="space-y-2">
            <p>
              <strong>Has admin_auth cookie:</strong> {cookieInfo.hasAuthCookie ? "Yes" : "No"}
            </p>
            <p>
              <strong>Total cookies:</strong> {cookieInfo.cookieCount}
            </p>
            <p>
              <strong>All cookies:</strong>
            </p>
            <div className="bg-gray-100 p-2 rounded text-xs max-h-32 overflow-auto">
              {cookieInfo.allCookies.length > 0
                ? cookieInfo.allCookies.map((cookie, index) => <div key={index}>{cookie}</div>)
                : "None"}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <h3 className="font-semibold mb-2">Browser Info:</h3>
          <div className="space-y-1">
            <p>
              <strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
            </p>
            <p>
              <strong>Cookie Enabled:</strong> {navigator.cookieEnabled ? "Yes" : "No"}
            </p>
            <p>
              <strong>Current URL:</strong> {window.location.href}
            </p>
            <p>
              <strong>Protocol:</strong> {window.location.protocol}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={fetchDebugInfo} variant="outline" size="sm">
            Refresh Debug Info
          </Button>
          <Button onClick={testAuthCheck} variant="outline" size="sm">
            Test Auth Check API
          </Button>
          <Button onClick={clearAllCookies} variant="outline" size="sm">
            Clear All Cookies
          </Button>
          <Button onClick={() => (window.location.href = "/admin")} size="sm">
            Force Redirect to Admin
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
