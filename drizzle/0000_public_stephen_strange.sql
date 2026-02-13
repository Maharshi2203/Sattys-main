CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_code" text,
	"name" text NOT NULL,
	"brand_name" text,
	"company_name" text,
	"category_id" integer,
	"case_size" text,
	"pack_size" text,
	"shelf_life" text,
	"base_price" numeric(10, 2) NOT NULL,
	"gst_percentage" numeric(5, 2) DEFAULT '0',
	"final_price" numeric(10, 2) NOT NULL,
	"description" text,
	"image_url" text,
	"images" text[],
	"stock_status" text DEFAULT 'IN',
	"is_featured" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "price_idx" ON "products" USING btree ("final_price");--> statement-breakpoint
CREATE INDEX "name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "featured_idx" ON "products" USING btree ("is_featured");