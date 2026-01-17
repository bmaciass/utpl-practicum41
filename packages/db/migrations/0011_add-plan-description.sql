ALTER TABLE "InstitutionalPlan" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "InstitutionalPlan" ADD COLUMN "description" text NOT NULL;