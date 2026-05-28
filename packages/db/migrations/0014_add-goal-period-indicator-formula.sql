CREATE TYPE "public"."GoalPeriod" AS ENUM('annual', 'multiannual');--> statement-breakpoint
ALTER TYPE "public"."ProjectGoalStatus" RENAME TO "ProjectTaskStatus";--> statement-breakpoint
ALTER TABLE "Goal" ADD COLUMN "period" "GoalPeriod" DEFAULT 'annual' NOT NULL;--> statement-breakpoint
ALTER TABLE "Goal" ADD COLUMN "targetValue" integer;--> statement-breakpoint
ALTER TABLE "Goal" ADD COLUMN "startDate" date;--> statement-breakpoint
ALTER TABLE "Goal" ADD COLUMN "endDate" date;--> statement-breakpoint
ALTER TABLE "Indicator" ADD COLUMN "formula" text;--> statement-breakpoint
ALTER TABLE "Indicator" ADD COLUMN "responsibleId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_responsibleId_User_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;