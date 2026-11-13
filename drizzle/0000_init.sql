CREATE TABLE "gg_products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'Face Wash' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"compare_at" integer,
	"size" text DEFAULT '' NOT NULL,
	"rating" numeric(2, 1) DEFAULT 4.5 NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"best_seller" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"shade" text DEFAULT '335 82% 46%' NOT NULL,
	"short" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"key_ingredients" text[] DEFAULT '{}' NOT NULL,
	"benefits" text[] DEFAULT '{}' NOT NULL,
	"how_to_use" text DEFAULT '' NOT NULL,
	"skin_type" text DEFAULT '' NOT NULL,
	"links" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gg_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "gg_products" ENABLE ROW LEVEL SECURITY;