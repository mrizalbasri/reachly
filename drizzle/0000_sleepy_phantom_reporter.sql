CREATE TYPE "public"."pipeline_status" AS ENUM('prospek', 'outreach', 'nego', 'deal', 'posting', 'selesai');--> statement-breakpoint
CREATE TABLE "campaign_kols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"kol_id" uuid NOT NULL,
	"allocated_budget" numeric,
	"status" "pipeline_status" DEFAULT 'prospek',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"total_budget" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"name" text NOT NULL,
	"platform" text NOT NULL,
	"username" text,
	"niche" text,
	"followers" integer DEFAULT 0,
	"engagement_rate" numeric,
	"rate_per_post" numeric,
	"contact" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"clerk_org_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "organizations_clerk_org_id_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "performance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_kol_id" uuid NOT NULL,
	"views" integer,
	"engagement" integer,
	"conversions" integer,
	"cpm" numeric,
	"cpe" numeric,
	"cpv" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pipeline_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kol_id" uuid NOT NULL,
	"campaign_id" uuid,
	"status" "pipeline_status" DEFAULT 'prospek' NOT NULL,
	"notes" text,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campaign_kols" ADD CONSTRAINT "campaign_kols_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_kols" ADD CONSTRAINT "campaign_kols_kol_id_kols_id_fk" FOREIGN KEY ("kol_id") REFERENCES "public"."kols"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kols" ADD CONSTRAINT "kols_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_records" ADD CONSTRAINT "performance_records_campaign_kol_id_campaign_kols_id_fk" FOREIGN KEY ("campaign_kol_id") REFERENCES "public"."campaign_kols"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_entries" ADD CONSTRAINT "pipeline_entries_kol_id_kols_id_fk" FOREIGN KEY ("kol_id") REFERENCES "public"."kols"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_entries" ADD CONSTRAINT "pipeline_entries_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;