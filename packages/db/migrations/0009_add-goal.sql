CREATE TABLE "Goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text NOT NULL,
	"institutionalObjectiveId" integer NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Goal_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "InstitutionalEstrategicObjetive" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_institutionalObjectiveId_InstitutionalEstrategicObjetive_id_fk" FOREIGN KEY ("institutionalObjectiveId") REFERENCES "public"."InstitutionalEstrategicObjetive"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;