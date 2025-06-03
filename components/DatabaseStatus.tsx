"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Database, AlertCircle, CheckCircle } from "lucide-react"

export default function DatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        setDbStatus("connected")
      } else {
        setDbStatus("disconnected")
      }
    } catch (error) {
      setDbStatus("disconnected")
    }
  }

  if (!showStatus && dbStatus === "connected") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {dbStatus === "disconnected" && (
        <Alert className="max-w-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Using demo data (DB not connected)</span>
            <Button variant="ghost" size="sm" onClick={() => setShowStatus(false)}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {dbStatus === "connected" && showStatus && (
        <Alert className="max-w-sm">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Database connected</span>
            <Button variant="ghost" size="sm" onClick={() => setShowStatus(false)}>
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!showStatus && (
        <Button variant="outline" size="sm" onClick={() => setShowStatus(true)} className="bg-white shadow-lg">
          <Database className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
