import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Database, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"

export default function AdminSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Setup Guide</h1>
        <p className="text-gray-600">Connect your Neon database for full admin functionality</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Current Status */}
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Current Status: Demo Mode</p>
              <p>The platform is running with demo data. To enable full admin features, connect a database.</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Step 1: Create Neon Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
              Create a Neon Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Neon provides a free PostgreSQL database that's perfect for this project.</p>
            <div className="space-y-2">
              <p className="font-semibold">Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Go to{" "}
                  <a
                    href="https://neon.tech"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    neon.tech
                  </a>
                </li>
                <li>Sign up for a free account</li>
                <li>Create a new project</li>
                <li>Copy the connection string from the dashboard</li>
              </ol>
            </div>
            <Button variant="outline" asChild>
              <a href="https://neon.tech" target="_blank" className="flex items-center gap-2" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
                Open Neon.tech
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Set Environment Variable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </span>
              Set Environment Variable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Add your database connection string to your environment variables.</p>
            <div className="space-y-2">
              <p className="font-semibold">Create .env.local file:</p>
              <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">.env.local</span>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <pre>{`DATABASE_URL="postgresql://username:password@host/database"
ADMIN_USER="admin"
ADMIN_PASS="Password@123"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Run Database Schema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
              Run Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Execute the SQL schema to create the required tables and sample data.</p>
            <div className="space-y-2">
              <p className="font-semibold">In your Neon SQL Editor, run:</p>
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <p>
                  Copy the contents of <code>database/schema.sql</code> and execute it in your Neon console.
                </p>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                The schema includes sample categories and products to get you started quickly.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 4: Restart Application */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                4
              </span>
              Restart Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Restart your development server to load the new environment variables.</p>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
              <pre>{`npm run dev`}</pre>
            </div>
            <p className="text-sm text-gray-600">
              After restart, the database status indicator should show "Connected" and all admin features will be
              available.
            </p>
          </CardContent>
        </Card>

        {/* What You Get */}
        <Card>
          <CardHeader>
            <CardTitle>What You Get With Database Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold">Admin Features:</p>
                <ul className="text-sm space-y-1">
                  <li>• Create/edit categories</li>
                  <li>• Add/manage products</li>
                  <li>• Upload product images</li>
                  <li>• Set bulk pricing tiers</li>
                  <li>• Track inventory</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Customer Features:</p>
                <ul className="text-sm space-y-1">
                  <li>• Order logging</li>
                  <li>• WhatsApp integration</li>
                  <li>• Real-time inventory</li>
                  <li>• Dynamic pricing</li>
                  <li>• Order history</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="flex gap-4">
          <Link href="/admin/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">View Store</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
