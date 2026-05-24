ALTER TABLE "Program" ADD COLUMN "institutionId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "Program" ADD CONSTRAINT "Program_institutionId_Institution_id_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Program_institutionId_idx" ON "Program" USING btree ("institutionId");