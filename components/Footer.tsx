import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold">Electronics Hub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for wholesale electronics. Quality products at competitive prices.
            </p>
            <div className="flex space-x-4">
              <span className="text-green-400">📱 WhatsApp Checkout</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/mobiles" className="text-gray-400 hover:text-white transition-colors">
                  Mobile Phones
                </Link>
              </li>
              <li>
                <Link href="/category/laptops" className="text-gray-400 hover:text-white transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-gray-400 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@electronicshub.com</p>
              <p>📱 +91 98765 43210</p>
              <p>🕒 Mon-Sat: 9AM-6PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Electronics Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
