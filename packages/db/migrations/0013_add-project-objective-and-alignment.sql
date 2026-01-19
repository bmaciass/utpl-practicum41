CREATE TABLE "ProjectObjective" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"status" "ProjectGoalStatus" DEFAULT 'pending' NOT NULL,
	"projectId" integer NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProjectObjective_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "AlignmentProjectObjectiveWithODS" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectObjectiveId" integer NOT NULL,
	"objectiveODSId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_projectObjectiveId_ProjectObjective_id_fk" FOREIGN KEY ("projectObjectiveId") REFERENCES "public"."ProjectObjective"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_objectiveODSId_ObjectiveODS_id_fk" FOREIGN KEY ("objectiveODSId") REFERENCES "public"."ObjectiveODS"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
