import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  text,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const buyerProfiles = pgTable("buyer_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),
  businessType: varchar("business_type", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  preferredFabric: varchar("preferred_fabric", { length: 100 }),
  typicalOrderQuantity: integer("typical_order_quantity"),
  budgetRange: varchar("budget_range", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supplierProfiles = pgTable("supplier_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),
  businessName: varchar("business_name", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  contactNumber: varchar("contact_number", { length: 20 }),
  businessAddress: text("business_address"),
  operatingHours: varchar("operating_hours", { length: 100 }),
  fabricsOffered: text("fabrics_offered"),
  minimumOrderQuantity: integer("minimum_order_quantity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => supplierProfiles.id, {
      onDelete: "cascade",
    }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  material: varchar("material", { length: 100 }),
  composition: varchar("composition", { length: 100 }),
  gsm: integer("gsm"),
  width: varchar("width", { length: 50 }),
  color: varchar("color", { length: 100 }),
  moq: integer("moq"),
  stock: integer("stock").default(0),
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),
  imageUrl: text("image_url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  isPrimary: boolean("is_primary").default(false),
  displayOrder: integer("display_order").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id, {
      onDelete: "cascade",
    }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").default(1).notNull(),
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, {
      onDelete: "cascade",
    }),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  status: varchar("status", { length: 30 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
