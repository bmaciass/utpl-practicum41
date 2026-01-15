ALTER TABLE "ProjectGoal" RENAME TO "ProjectTask";--> statement-breakpoint
ALTER TABLE "ProjectTask" DROP CONSTRAINT "ProjectGoal_uid_unique";--> statement-breakpoint
ALTER TABLE "ProjectTask" DROP CONSTRAINT "ProjectGoal_projectId_Project_id_fk";
--> statement-breakpoint
ALTER TABLE "ProjectTask" DROP CONSTRAINT "ProjectGoal_createdBy_User_id_fk";
--> statement-breakpoint
ALTER TABLE "ProjectTask" DROP CONSTRAINT "ProjectGoal_updatedBy_User_id_fk";
--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD COLUMN "responsibleId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_responsibleId_User_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_uid_unique" UNIQUE("uid");