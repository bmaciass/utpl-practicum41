CREATE TYPE "public"."AuditEventStatus" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
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
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_User_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "AuditEvent_status_idx" ON "AuditEvent" USING btree ("status");--> statement-breakpoint
CREATE INDEX "AuditEvent_actorUserId_idx" ON "AuditEvent" USING btree ("actorUserId");--> statement-breakpoint
CREATE INDEX "AuditEvent_resource_idx" ON "AuditEvent" USING btree ("resourceType","resourceUid");--> statement-breakpoint
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent" USING btree ("action");
