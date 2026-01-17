CREATE TYPE "public"."indicatorType" AS ENUM('number', 'percentage');--> statement-breakpoint
CREATE TABLE "Indicator" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"type" "indicatorType",
	"unitType" varchar,
	"minValue" integer,
	"maxValue" integer,
	"goalId" integer NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Indicator_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_goalId_Goal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."Goal"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;