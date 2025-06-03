"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "admin",
    password: "Password@123",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Redirect to dashboard
        window.location.href = "/admin/dashboard"
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      username: "admin",
      password: "Password@123",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-gray-600">Enter your credentials to access the admin panel</p>
        </CardHeader>
        <CardContent>
          {/* Demo Credentials Info */}
          <Alert className="mb-4">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Demo Credentials:</p>
                <p>
                  Username: <code className="bg-gray-100 px-1 rounded">admin</code>
                </p>
                <p>
                  Password: <code className="bg-gray-100 px-1 rounded">Password@123</code>
                </p>
                <Button onClick={fillDemoCredentials} variant="outline" size="sm" className="mt-2">
                  Use Demo Credentials
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-500">Need help? The demo credentials are pre-filled above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
