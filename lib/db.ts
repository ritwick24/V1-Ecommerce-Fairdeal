import { neon } from "@neondatabase/serverless"

// Create a SQL query function using the Neon connection
// Add error handling for missing DATABASE_URL
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  } else {
    console.warn("DATABASE_URL not found. Database operations will use fallback data.")
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error)
}

// Fallback data for when database is not available
const fallbackCategories = [
  {
    id: 1,
    name: "Mobile Phones",
    slug: "mobiles",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Laptops",
    slug: "laptops",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Tablets",
    slug: "tablets",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Accessories",
    slug: "accessories",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Smart Watches",
    slug: "smartwatches",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Audio Devices",
    slug: "audio",
    image: "/placeholder.svg?height=200&width=200",
    product_count: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const fallbackProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    images: ["/placeholder.svg?height=600&width=600"],
    stock: 50,
    min_price: 83000,
    category_names: ["Mobile Phones"],
    category_slugs: ["mobiles"],
    category_ids: [1],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { min_quantity: 1, max_quantity: 5, price: 89000 },
      { min_quantity: 6, max_quantity: 15, price: 87000 },
      { min_quantity: 16, max_quantity: 30, price: 85000 },
      { min_quantity: 31, max_quantity: null, price: 83000 },
    ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Premium Android flagship with S Pen, 200MP camera, and AI features",
    images: ["/placeholder.svg?height=600&width=600"],
    stock: 35,
    min_price: 73000,
    category_names: ["Mobile Phones"],
    category_slugs: ["mobiles"],
    category_ids: [1],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { min_quantity: 1, max_quantity: 5, price: 78000 },
      { min_quantity: 6, max_quantity: 15, price: 76000 },
      { min_quantity: 16, max_quantity: 30, price: 75000 },
      { min_quantity: 31, max_quantity: null, price: 73000 },
    ],
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    slug: "macbook-pro-16",
    description: "Professional laptop with M3 Pro chip, Liquid Retina XDR display",
    images: ["/placeholder.svg?height=600&width=600"],
    stock: 20,
    min_price: 178000,
    category_names: ["Laptops"],
    category_slugs: ["laptops"],
    category_ids: [2],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { min_quantity: 1, max_quantity: 3, price: 185000 },
      { min_quantity: 4, max_quantity: 10, price: 182000 },
      { min_quantity: 11, max_quantity: 20, price: 180000 },
      { min_quantity: 21, max_quantity: null, price: 178000 },
    ],
  },
  {
    id: 4,
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    description: "Premium wireless earbuds with active noise cancellation",
    images: ["/placeholder.svg?height=600&width=600"],
    stock: 100,
    min_price: 17500,
    category_names: ["Accessories"],
    category_slugs: ["accessories"],
    category_ids: [4],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [
      { min_quantity: 1, max_quantity: 10, price: 19000 },
      { min_quantity: 11, max_quantity: 25, price: 18500 },
      { min_quantity: 26, max_quantity: 50, price: 18000 },
      { min_quantity: 51, max_quantity: null, price: 17500 },
    ],
  },
]

// Category functions
export async function getCategories() {
  try {
    if (!sql) {
      console.log("Using fallback categories data")
      return fallbackCategories
    }

    const categories = await sql`
      SELECT c.*, COUNT(pc.product_id)::int as product_count 
      FROM categories c 
      LEFT JOIN product_categories pc ON c.id = pc.category_id 
      GROUP BY c.id 
      ORDER BY c.name
    `
    return categories
  } catch (error) {
    console.error("Database error in getCategories:", error)
    console.log("Falling back to static categories data")
    return fallbackCategories
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    if (!sql) {
      console.log("Using fallback category data for slug:", slug)
      const category = fallbackCategories.find((c) => c.slug === slug)
      if (!category) return null

      const products = fallbackProducts.filter((p) => p.category_slugs.includes(slug))
      return { category, products }
    }

    const category = await sql`SELECT * FROM categories WHERE slug = ${slug}`

    if (category.length === 0) return null

    const products = await sql`
      SELECT p.*, 
             MIN(pp.price)::numeric as min_price,
             ARRAY_AGG(DISTINCT c.name) as category_names,
             ARRAY_AGG(DISTINCT c.slug) as category_slugs
      FROM products p
      LEFT JOIN product_prices pp ON p.id = pp.product_id
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE pc.category_id = ${category[0].id} AND p.stock > 0
      GROUP BY p.id
      ORDER BY p.name
    `

    return {
      category: category[0],
      products: products,
    }
  } catch (error) {
    console.error("Database error in getCategoryBySlug:", error)
    console.log("Falling back to static data for slug:", slug)
    const category = fallbackCategories.find((c) => c.slug === slug)
    if (!category) return null

    const products = fallbackProducts.filter((p) => p.category_slugs.includes(slug))
    return { category, products }
  }
}

// Product functions
export async function getProductBySlug(slug: string) {
  try {
    if (!sql) {
      console.log("Using fallback product data for slug:", slug)
      const product = fallbackProducts.find((p) => p.slug === slug)
      if (!product) return null

      return {
        ...product,
        category_name: product.category_names[0] || "Uncategorized",
        category_slug: product.category_slugs[0] || "uncategorized",
      }
    }

    const product = await sql`
      SELECT p.*, 
             ARRAY_AGG(DISTINCT c.name) as category_names,
             ARRAY_AGG(DISTINCT c.slug) as category_slugs,
             ARRAY_AGG(DISTINCT c.id) as category_ids
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.slug = ${slug}
      GROUP BY p.id
    `

    if (product.length === 0) return null

    const prices = await sql`
      SELECT min_quantity, max_quantity, price::numeric as price
      FROM product_prices
      WHERE product_id = ${product[0].id}
      ORDER BY min_quantity
    `

    return {
      ...product[0],
      prices: prices,
      // Use the first category for backward compatibility
      category_name: product[0].category_names?.[0] || "Uncategorized",
      category_slug: product[0].category_slugs?.[0] || "uncategorized",
    }
  } catch (error) {
    console.error("Database error in getProductBySlug:", error)
    console.log("Falling back to static data for slug:", slug)
    const product = fallbackProducts.find((p) => p.slug === slug)
    if (!product) return null

    return {
      ...product,
      category_name: product.category_names[0] || "Uncategorized",
      category_slug: product.category_slugs[0] || "uncategorized",
    }
  }
}

export async function getAllProducts() {
  try {
    if (!sql) {
      console.log("Using fallback products data")
      return fallbackProducts.map((product) => ({
        ...product,
        category_name: product.category_names[0] || "Uncategorized",
      }))
    }

    const products = await sql`
      SELECT p.*, 
             ARRAY_AGG(DISTINCT c.name) as category_names,
             MIN(pp.price)::numeric as min_price
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_prices pp ON p.id = pp.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `

    // Format the results for backward compatibility
    return products.map((product) => ({
      ...product,
      category_name: product.category_names?.[0] || "Uncategorized",
    }))
  } catch (error) {
    console.error("Database error in getAllProducts:", error)
    console.log("Falling back to static products data")
    return fallbackProducts.map((product) => ({
      ...product,
      category_name: product.category_names[0] || "Uncategorized",
    }))
  }
}

// Admin functions - these will only work with a real database
export async function createCategory(name: string, slug: string, image?: string) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    const result = await sql`
      INSERT INTO categories (name, slug, image) 
      VALUES (${name}, ${slug}, ${image || null}) 
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Database error in createCategory:", error)
    throw error
  }
}

export async function updateCategory(id: number, name: string, slug: string, image?: string) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    const result = await sql`
      UPDATE categories 
      SET name = ${name}, slug = ${slug}, image = ${image || null}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id} 
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Database error in updateCategory:", error)
    throw error
  }
}

export async function deleteCategory(id: number) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    // Delete related entries in product_categories (CASCADE should handle this, but being explicit)
    await sql`DELETE FROM product_categories WHERE category_id = ${id}`
    // Delete the category itself
    await sql`DELETE FROM categories WHERE id = ${id}`
  } catch (error) {
    console.error("Database error in deleteCategory:", error)
    throw error
  }
}

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  images: string[]
  stock: number
  category_ids?: number[]
}) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    // Check if slug already exists
    const existingProduct = await sql`SELECT id FROM products WHERE slug = ${data.slug} LIMIT 1`

    // If slug exists, make it unique by appending a timestamp
    let uniqueSlug = data.slug
    if (existingProduct.length > 0) {
      uniqueSlug = `${data.slug}-${Date.now().toString().slice(-6)}`
    }

    const result = await sql`
      INSERT INTO products (name, slug, description, images, stock) 
      VALUES (${data.name}, ${uniqueSlug}, ${data.description}, ${data.images}, ${data.stock}) 
      RETURNING *
    `

    const product = result[0]

    // Add category associations if provided
    if (data.category_ids && data.category_ids.length > 0) {
      for (const categoryId of data.category_ids) {
        await sql`
          INSERT INTO product_categories (product_id, category_id) 
          VALUES (${product.id}, ${categoryId})
        `
      }
    }

    return product
  } catch (error) {
    console.error("Database error in createProduct:", error)
    throw error
  }
}

export async function updateProduct(
  id: number,
  data: {
    name: string
    slug: string
    description: string
    images: string[]
    stock: number
    category_ids?: number[]
  },
) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    const result = await sql`
      UPDATE products 
      SET name = ${data.name}, slug = ${data.slug}, description = ${data.description}, 
          images = ${data.images}, stock = ${data.stock}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id} 
      RETURNING *
    `

    // Update category associations
    if (data.category_ids !== undefined) {
      // Remove existing associations
      await sql`DELETE FROM product_categories WHERE product_id = ${id}`

      // Add new associations
      if (data.category_ids.length > 0) {
        for (const categoryId of data.category_ids) {
          await sql`
            INSERT INTO product_categories (product_id, category_id) 
            VALUES (${id}, ${categoryId})
          `
        }
      }
    }

    return result[0]
  } catch (error) {
    console.error("Database error in updateProduct:", error)
    throw error
  }
}

export async function deleteProduct(id: number) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    // Delete category associations (CASCADE should handle this, but being explicit)
    await sql`DELETE FROM product_categories WHERE product_id = ${id}`
    // Delete product prices
    await sql`DELETE FROM product_prices WHERE product_id = ${id}`
    // Delete the product itself
    await sql`DELETE FROM products WHERE id = ${id}`
  } catch (error) {
    console.error("Database error in deleteProduct:", error)
    throw error
  }
}

export async function createProductPrice(
  product_id: number,
  min_quantity: number,
  max_quantity: number | null,
  price: number,
) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    const result = await sql`
      INSERT INTO product_prices (product_id, min_quantity, max_quantity, price) 
      VALUES (${product_id}, ${min_quantity}, ${max_quantity}, ${price}) 
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Database error in createProductPrice:", error)
    throw error
  }
}

export async function updateProductPrices(
  product_id: number,
  prices: Array<{ min_quantity: number; max_quantity: number | null; price: number }>,
) {
  try {
    if (!sql) {
      throw new Error("Database connection required for admin operations")
    }

    // Delete existing prices
    await sql`DELETE FROM product_prices WHERE product_id = ${product_id}`

    // Insert new prices
    for (const price of prices) {
      await createProductPrice(product_id, price.min_quantity, price.max_quantity, price.price)
    }
  } catch (error) {
    console.error("Database error in updateProductPrices:", error)
    throw error
  }
}

export async function logOrder(data: {
  products: any[]
  quantities: any[]
  total_price: number
  user_contact?: string
  user_name?: string
  user_email?: string
  user_address?: string
  notes?: string
}) {
  try {
    if (!sql) {
      console.log("Database not available, order logging skipped:", data)
      return { id: Date.now(), ...data, created_at: new Date().toISOString() }
    }

    const result = await sql`
      INSERT INTO orders_log (products, quantities, total_price, user_contact, user_name, user_email, user_address, notes) 
      VALUES (${JSON.stringify(data.products)}, ${JSON.stringify(data.quantities)}, ${data.total_price}, 
              ${data.user_contact || null}, ${data.user_name || null}, ${data.user_email || null}, 
              ${data.user_address || null}, ${data.notes || null}) 
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Database error in logOrder:", error)
    throw error
  }
}

export async function getOrders(limit = 50, offset = 0) {
  try {
    if (!sql) {
      console.log("Database not available, returning empty orders")
      return []
    }

    const orders = await sql`
      SELECT * FROM orders_log 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
    return orders
  } catch (error) {
    console.error("Database error in getOrders:", error)
    return []
  }
}

// New helper functions for category management
export async function getProductCategories(productId: number) {
  try {
    if (!sql) {
      return []
    }

    const categories = await sql`
      SELECT c.* 
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      WHERE pc.product_id = ${productId}
      ORDER BY c.name
    `
    return categories
  } catch (error) {
    console.error("Database error in getProductCategories:", error)
    return []
  }
}

export async function getCategoryById(id: number) {
  try {
    if (!sql) {
      return fallbackCategories.find((c) => c.id === id) || null
    }

    const result = await sql`SELECT * FROM categories WHERE id = ${id}`
    return result[0] || null
  } catch (error) {
    console.error("Database error in getCategoryById:", error)
    return null
  }
}
