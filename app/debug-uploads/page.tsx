"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugUploadsPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkUploads = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-static")
      const data = await response.json()
      setDebugInfo(data)
      console.log("Debug info:", data)
    } catch (error) {
      console.error("Error checking uploads:", error)
      setDebugInfo({ error: "Failed to fetch debug info" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUploads()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Debug Uploads Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkUploads} disabled={loading}>
            {loading ? "Checking..." : "Refresh"}
          </Button>

          {debugInfo && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded text-sm">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>

              {debugInfo.files && debugInfo.files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Uploaded Files:</h3>
                  {debugInfo.files.map((file: any, index: number) => (
                    <div key={index} className="border p-2 rounded">
                      <p>
                        <strong>Name:</strong> {file.name}
                      </p>
                      <p>
                        <strong>Size:</strong> {file.size} bytes
                      </p>
                      <p>
                        <strong>URL:</strong> {file.url}
                      </p>
                      <div className="mt-2">
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="max-w-xs h-32 object-cover border"
                          onLoad={() => console.log(`Image loaded: ${file.url}`)}
                          onError={() => console.error(`Image failed: ${file.url}`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
