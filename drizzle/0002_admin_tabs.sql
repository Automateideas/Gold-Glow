CREATE TABLE "gg_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"product_name" text DEFAULT '' NOT NULL,
	"marketplace" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gg_clicks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gg_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gg_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gg_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"text" text NOT NULL,
	"product" text DEFAULT '' NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gg_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gg_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gg_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gg_subscribers" (
	"email" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gg_subscribers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gg_products" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "gg_clicks_created_idx" ON "gg_clicks" USING btree ("created_at");