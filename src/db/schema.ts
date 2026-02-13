import { pgTable, text, serial, timestamp, boolean, decimal, integer, index } from "drizzle-orm/pg-core";

// Define products table matching the application's Product interface
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    product_code: text("product_code"),
    name: text("name").notNull(),
    brand_name: text("brand_name"),
    company_name: text("company_name"),
    category_id: integer("category_id"), // Relation to categories table (assumed existing or future)
    case_size: text("case_size"),
    pack_size: text("pack_size"),
    shelf_life: text("shelf_life"),
    base_price: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    gst_percentage: decimal("gst_percentage", { precision: 5, scale: 2 }).default("0"),
    final_price: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
    image_url: text("image_url"),
    images: text("images").array(), // Array of strings for multiple images
    stock_status: text("stock_status").default('IN'), // 'IN' | 'OUT'
    is_featured: boolean("is_featured").default(false),
    isActive: boolean("is_active").default(true), // Kept from user request
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        priceIdx: index("price_idx").on(table.final_price),
        nameIdx: index("name_idx").on(table.name),
        categoryIdx: index("category_idx").on(table.category_id),
        featuredIdx: index("featured_idx").on(table.is_featured),
    };
});
