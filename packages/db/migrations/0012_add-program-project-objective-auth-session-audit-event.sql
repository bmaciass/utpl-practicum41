CREATE TYPE "public"."AuditEventStatus" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
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
CREATE TABLE "AuditEvent" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"status" "AuditEventStatus" DEFAULT 'pending' NOT NULL,
	"action" varchar(128) NOT NULL,
	"resourceType" varchar(128) NOT NULL,
	"resourceUid" varchar(64),
	"actorUserId" integer,
	"actorLabel" varchar(255),
	"requestPayload" jsonb,
	"beforeSnapshot" jsonb,
	"afterSnapshot" jsonb,
	"error" jsonb,
	"metadata" jsonb,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AuditEvent_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "AuthSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"userId" integer NOT NULL,
	"tokenHash" varchar(128) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"idleExpiresAt" timestamp NOT NULL,
	"lastUsedAt" timestamp NOT NULL,
	"revokedAt" timestamp,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AuthSession_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
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
ALTER TABLE "Program" ADD COLUMN "estimatedInversion" numeric;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_projectObjectiveId_ProjectObjective_id_fk" FOREIGN KEY ("projectObjectiveId") REFERENCES "public"."ProjectObjective"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_objectiveODSId_ObjectiveODS_id_fk" FOREIGN KEY ("objectiveODSId") REFERENCES "public"."ObjectiveODS"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentProjectObjectiveWithODS" ADD CONSTRAINT "AlignmentProjectObjectiveWithODS_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_User_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectObjective" ADD CONSTRAINT "ProjectObjective_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "AuditEvent_status_idx" ON "AuditEvent" USING btree ("status");--> statement-breakpoint
CREATE INDEX "AuditEvent_actorUserId_idx" ON "AuditEvent" USING btree ("actorUserId");--> statement-breakpoint
CREATE INDEX "AuditEvent_resource_idx" ON "AuditEvent" USING btree ("resourceType","resourceUid");--> statement-breakpoint
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent" USING btree ("action");