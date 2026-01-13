CREATE TYPE "public"."InstitutionArea" AS ENUM('educacion');--> statement-breakpoint
CREATE TYPE "public"."InstitutionGovernanceLevel" AS ENUM('nacional');--> statement-breakpoint
CREATE TYPE "public"."actionPermission" AS ENUM('create', 'delete', 'read', 'update', 'list', 'approve');--> statement-breakpoint
CREATE TYPE "public"."effectPermission" AS ENUM('deny', 'allow');--> statement-breakpoint
CREATE TYPE "public"."scopePermission" AS ENUM('module', 'resource');--> statement-breakpoint
CREATE TYPE "public"."ProjectStatus" AS ENUM('pending', 'in_progress', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ProjectGoalStatus" AS ENUM('pending', 'in_progress', 'reviewing', 'done', 'cancelled');--> statement-breakpoint
CREATE TABLE "AlignmentObjectiveStrategicWithPND" (
	"id" serial PRIMARY KEY NOT NULL,
	"objectiveStrategicId" integer NOT NULL,
	"objectivePNDId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AlignmentObjectivePNDWithODS" (
	"id" serial PRIMARY KEY NOT NULL,
	"objectivePNDId" integer NOT NULL,
	"objectiveODSId" integer NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Institution" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"area" "InstitutionArea" NOT NULL,
	"level" "InstitutionGovernanceLevel" NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Institution_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "institutionalClassification" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"code" varchar(64) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"parentId" integer,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "institutionalClassification_code_unique" UNIQUE("code"),
	CONSTRAINT "institutionalClassification_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "InstitutionalEstrategicObjetive" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"institutionId" integer,
	"startDate" date,
	"endDate" date,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "InstitutionalEstrategicObjetive_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "InstitutionalPlan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"year" smallint NOT NULL,
	"version" smallint NOT NULL,
	"url" varchar NOT NULL,
	"institutionId" integer NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "InstitutionalPlan_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "institutionalUnit" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"institutionId" integer,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "institutionalUnit_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "ObjectiveODS" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ObjectiveODS_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "ObjectivePND" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ObjectivePND_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "PermissionRole" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"roleId" integer NOT NULL,
	"action" "actionPermission" NOT NULL,
	"effect" "effectPermission" NOT NULL,
	"scope" "scopePermission" NOT NULL,
	CONSTRAINT "PermissionRole_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Person" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"firstName" varchar(64) NOT NULL,
	"lastName" varchar(64) NOT NULL,
	"dni" varchar(15) NOT NULL,
	"deletedAt" timestamp,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Person_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Program" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"description" text,
	"responsibleId" integer NOT NULL,
	"startDate" date,
	"endDate" date,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Program_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"description" text,
	"status" "ProjectStatus" DEFAULT 'pending' NOT NULL,
	"startDate" date,
	"endDate" date,
	"responsibleId" integer NOT NULL,
	"programId" integer NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Project_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "ProjectGoal" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"projectId" integer NOT NULL,
	"status" "ProjectGoalStatus" DEFAULT 'pending' NOT NULL,
	"startDate" date,
	"endDate" date,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProjectGoal_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Role" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"name" varchar NOT NULL,
	"deletedAt" timestamp,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Role_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"personId" integer NOT NULL,
	"password" varchar(512) NOT NULL,
	"salt" varchar(512) NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "User_uid_unique" UNIQUE("uid"),
	CONSTRAINT "User_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "UserRole" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdBy" integer NOT NULL,
	"updatedBy" integer,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL,
	"roleId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "AlignmentObjectiveStrategicWithPND" ADD CONSTRAINT "AlignmentObjectiveStrategicWithPND_objectiveStrategicId_InstitutionalEstrategicObjetive_id_fk" FOREIGN KEY ("objectiveStrategicId") REFERENCES "public"."InstitutionalEstrategicObjetive"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectiveStrategicWithPND" ADD CONSTRAINT "AlignmentObjectiveStrategicWithPND_objectivePNDId_ObjectivePND_id_fk" FOREIGN KEY ("objectivePNDId") REFERENCES "public"."ObjectivePND"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectiveStrategicWithPND" ADD CONSTRAINT "AlignmentObjectiveStrategicWithPND_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectiveStrategicWithPND" ADD CONSTRAINT "AlignmentObjectiveStrategicWithPND_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectivePNDWithODS" ADD CONSTRAINT "AlignmentObjectivePNDWithODS_objectivePNDId_ObjectivePND_id_fk" FOREIGN KEY ("objectivePNDId") REFERENCES "public"."ObjectivePND"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectivePNDWithODS" ADD CONSTRAINT "AlignmentObjectivePNDWithODS_objectiveODSId_ObjectiveODS_id_fk" FOREIGN KEY ("objectiveODSId") REFERENCES "public"."ObjectiveODS"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectivePNDWithODS" ADD CONSTRAINT "AlignmentObjectivePNDWithODS_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AlignmentObjectivePNDWithODS" ADD CONSTRAINT "AlignmentObjectivePNDWithODS_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalClassification" ADD CONSTRAINT "institutionalClassification_parentId_institutionalClassification_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."institutionalClassification"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalClassification" ADD CONSTRAINT "institutionalClassification_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalClassification" ADD CONSTRAINT "institutionalClassification_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalEstrategicObjetive" ADD CONSTRAINT "InstitutionalEstrategicObjetive_institutionId_Institution_id_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalEstrategicObjetive" ADD CONSTRAINT "InstitutionalEstrategicObjetive_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalEstrategicObjetive" ADD CONSTRAINT "InstitutionalEstrategicObjetive_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalPlan" ADD CONSTRAINT "InstitutionalPlan_institutionId_Institution_id_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalPlan" ADD CONSTRAINT "InstitutionalPlan_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InstitutionalPlan" ADD CONSTRAINT "InstitutionalPlan_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalUnit" ADD CONSTRAINT "institutionalUnit_institutionId_Institution_id_fk" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalUnit" ADD CONSTRAINT "institutionalUnit_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutionalUnit" ADD CONSTRAINT "institutionalUnit_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ObjectiveODS" ADD CONSTRAINT "ObjectiveODS_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ObjectiveODS" ADD CONSTRAINT "ObjectiveODS_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ObjectivePND" ADD CONSTRAINT "ObjectivePND_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ObjectivePND" ADD CONSTRAINT "ObjectivePND_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PermissionRole" ADD CONSTRAINT "PermissionRole_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PermissionRole" ADD CONSTRAINT "PermissionRole_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PermissionRole" ADD CONSTRAINT "PermissionRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Program" ADD CONSTRAINT "Program_responsibleId_User_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Program" ADD CONSTRAINT "Program_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Program" ADD CONSTRAINT "Program_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_responsibleId_User_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_programId_Program_id_fk" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Project" ADD CONSTRAINT "Project_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectGoal" ADD CONSTRAINT "ProjectGoal_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectGoal" ADD CONSTRAINT "ProjectGoal_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProjectGoal" ADD CONSTRAINT "ProjectGoal_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Role" ADD CONSTRAINT "Role_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_personId_Person_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE no action ON UPDATE no action;