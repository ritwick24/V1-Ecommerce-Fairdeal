import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, ShoppingCart, BarChart3, Database, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your wholesale electronics platform</p>
        </div>

        {/* Database Status Alert */}
        <Alert className="mb-8">
          <Database className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Database Status</p>
                <p className="text-sm">Currently using demo data. Connect a database for full admin functionality.</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/setup">Setup Database</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Demo products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Demo categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Database required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demo Mode</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ON</div>
              <p className="text-xs text-muted-foreground">Using fallback data</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">View and browse demo categories</p>
              <div className="flex gap-2">
                <Link href="/admin/categories">
                  <Button>View Categories</Button>
                </Link>
                <Link href="/admin/categories/new">
                  <Button variant="outline" disabled>
                    Add New (DB Required)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">View and browse demo products</p>
              <div className="flex gap-2">
                <Link href="/admin/products">
                  <Button>View Products</Button>
                </Link>
                <Link href="/admin/products/new">
                  <Button variant="outline" disabled>
                    Add New (DB Required)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">View customer orders and inquiries</p>
              <div className="flex gap-2">
                <Link href="/admin/orders">
                  <Button>View Orders</Button>
                </Link>
                <Button variant="outline" disabled>
                  Export (DB Required)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Connect your Neon database for full functionality</p>
              <div className="flex gap-2">
                <Link href="/admin/setup">
                  <Button variant="outline">Setup Guide</Button>
                </Link>
                <Link href="/test-upload">
                  <Button variant="outline">Test Upload</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demo Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Explore the platform with demo data</p>
              <div className="flex gap-2">
                <Link href="/" target="_blank">
                  <Button variant="outline">View Store</Button>
                </Link>
                <Link href="/cart">
                  <Button variant="outline">Test Cart</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Learn how to use and customize the platform</p>
              <div className="flex gap-2">
                <Link href="/debug-uploads">
                  <Button variant="outline">Debug Tools</Button>
                </Link>
                <Link href="/admin/help">
                  <Button variant="outline">Help Guide</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
