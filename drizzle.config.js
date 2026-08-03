import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schemaFilter: ["public"],
  tablesFilter: [
    "profiles",
    "buyer_profiles",
    "supplier_profiles",
    "categories",
    "products",
    "product_images",
    "carts",
    "cart_items",
    "orders",
    "order_items",
  ],
});