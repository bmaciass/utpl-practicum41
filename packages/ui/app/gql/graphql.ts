/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type. */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AuthLoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AuthLoginResponse = {
  __typename?: 'AuthLoginResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

/** Auth mutations */
export type AuthMutations = {
  __typename?: 'AuthMutations';
  login?: Maybe<AuthLoginResponse>;
  refresh?: Maybe<AuthRefreshResponse>;
};


/** Auth mutations */
export type AuthMutationsLoginArgs = {
  data: AuthLoginInput;
};


/** Auth mutations */
export type AuthMutationsRefreshArgs = {
  data: AuthRefreshInput;
};

export type AuthRefreshInput = {
  refreshToken: Scalars['String']['input'];
};

export type AuthRefreshResponse = {
  __typename?: 'AuthRefreshResponse';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type CreateInstitutionDataInput = {
  area: InstitutionArea;
  level: InstitutionLevel;
  name: Scalars['String']['input'];
};

export type CreateInstitutionalPlanDataInput = {
  institutionId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type CreateProgramDataInput = {
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  responsibleUid: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type CreateProjectDataInput = {
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  programUid: Scalars['String']['input'];
  responsibleUid: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status: ProjectStatus;
};

export type CreateProjectTaskDataInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  projectUid: Scalars['String']['input'];
  responsibleUid: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status: ProjectTaskStatus;
};

export type CreateUserDataInput = {
  dni: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Institution = {
  __typename?: 'Institution';
  active: Scalars['Boolean']['output'];
  area: InstitutionArea;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  level: InstitutionLevel;
  name: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
};

export enum InstitutionArea {
  Educacion = 'educacion'
}

export type InstitutionEstraticObjetive = {
  __typename?: 'InstitutionEstraticObjetive';
  active: Scalars['Boolean']['output'];
  endDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  startDate?: Maybe<Scalars['Date']['output']>;
  uid: Scalars['ID']['output'];
};

export enum InstitutionLevel {
  Nacional = 'nacional'
}

/** Institution mutations */
export type InstitutionMutations = {
  __typename?: 'InstitutionMutations';
  create: Institution;
  update: Institution;
};


/** Institution mutations */
export type InstitutionMutationsCreateArgs = {
  data: CreateInstitutionDataInput;
};


/** Institution mutations */
export type InstitutionMutationsUpdateArgs = {
  data: UpdateInstitutionDataInput;
  where: UpdateInstitutionWhereInput;
};

export type InstitutionPlan = {
  __typename?: 'InstitutionPlan';
  active: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  institution: Institution;
  name: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
  url: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

/** Institution queries */
export type InstitutionQueries = {
  __typename?: 'InstitutionQueries';
  list: InstitutionsQueryResponse;
  one?: Maybe<Institution>;
};


/** Institution queries */
export type InstitutionQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<StringFilter>;
};


/** Institution queries */
export type InstitutionQueriesOneArgs = {
  id: Scalars['String']['input'];
};

/** Institution Plan mutations */
export type InstitutionalPlanMutations = {
  __typename?: 'InstitutionalPlanMutations';
  create: InstitutionPlan;
  update: InstitutionPlan;
};


/** Institution Plan mutations */
export type InstitutionalPlanMutationsCreateArgs = {
  data: CreateInstitutionalPlanDataInput;
};


/** Institution Plan mutations */
export type InstitutionalPlanMutationsUpdateArgs = {
  data: UpdateInstitutionalPlanDataInput;
  where: UpdateInstitutionalPlanWhereInput;
};

/** Institutional Plan queries */
export type InstitutionalPlanQueries = {
  __typename?: 'InstitutionalPlanQueries';
  list: InstitutionalPlansQueryResponse;
  one?: Maybe<InstitutionPlan>;
};


/** Institutional Plan queries */
export type InstitutionalPlanQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  institutionUid: Scalars['String']['input'];
  name?: InputMaybe<StringFilter>;
};


/** Institutional Plan queries */
export type InstitutionalPlanQueriesOneArgs = {
  uid: Scalars['String']['input'];
};

export type InstitutionalPlansQueryResponse = {
  __typename?: 'InstitutionalPlansQueryResponse';
  records: Array<InstitutionPlan>;
};

export type InstitutionsQueryResponse = {
  __typename?: 'InstitutionsQueryResponse';
  records: Array<Institution>;
};

export type Mutation = {
  __typename?: 'Mutation';
  auth?: Maybe<AuthMutations>;
  institution: InstitutionMutations;
  institutionalPlan: InstitutionalPlanMutations;
  program: ProgramMutations;
  project: ProjectMutations;
  projectTask: ProjectTaskMutations;
  user: UserMutations;
};

export type ObjectiveOds = {
  __typename?: 'ObjectiveODS';
  active: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
};

/** ObjectiveODS queries */
export type ObjectiveOdsQueries = {
  __typename?: 'ObjectiveODSQueries';
  list: ObjectiveOdsQueryResponse;
};


/** ObjectiveODS queries */
export type ObjectiveOdsQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<StringFilter>;
};

export type ObjectiveOdsQueryResponse = {
  __typename?: 'ObjectiveODSQueryResponse';
  records: Array<ObjectiveOds>;
};

export type Person = {
  __typename?: 'Person';
  active: Scalars['Boolean']['output'];
  dni: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
};

export type Program = {
  __typename?: 'Program';
  active: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  projects: Array<Project>;
  responsible: User;
  startDate?: Maybe<Scalars['Date']['output']>;
  uid: Scalars['ID']['output'];
};

/** Program mutations */
export type ProgramMutations = {
  __typename?: 'ProgramMutations';
  create: Program;
  update: Program;
};


/** Program mutations */
export type ProgramMutationsCreateArgs = {
  data: CreateProgramDataInput;
};


/** Program mutations */
export type ProgramMutationsUpdateArgs = {
  data: UpdateProgramDataInput;
  where: UpdateProgramWhereInput;
};

/** Program queries */
export type ProgramQueries = {
  __typename?: 'ProgramQueries';
  list: ProgramsQueryResponse;
  one?: Maybe<Program>;
};


/** Program queries */
export type ProgramQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<StringFilter>;
};


/** Program queries */
export type ProgramQueriesOneArgs = {
  id: Scalars['String']['input'];
};

export type ProgramsQueryResponse = {
  __typename?: 'ProgramsQueryResponse';
  records: Array<Program>;
};

export type Project = {
  __typename?: 'Project';
  active: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  program: Program;
  responsible: User;
  startDate?: Maybe<Scalars['Date']['output']>;
  status: ProjectStatus;
  tasks: Array<ProjectTask>;
  uid: Scalars['ID']['output'];
};

/** Project mutations */
export type ProjectMutations = {
  __typename?: 'ProjectMutations';
  create: Project;
  update: Project;
};


/** Project mutations */
export type ProjectMutationsCreateArgs = {
  data: CreateProjectDataInput;
};


/** Project mutations */
export type ProjectMutationsUpdateArgs = {
  data: UpdateProjectDataInput;
  where: UpdateProjectWhereInput;
};

/** Project queries */
export type ProjectQueries = {
  __typename?: 'ProjectQueries';
  list: ProjectsQueryResponse;
  one?: Maybe<Project>;
};


/** Project queries */
export type ProjectQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  programId: Scalars['String']['input'];
};


/** Project queries */
export type ProjectQueriesOneArgs = {
  id: Scalars['String']['input'];
};

export enum ProjectStatus {
  Cancelled = 'cancelled',
  Done = 'done',
  InProgress = 'in_progress',
  Pending = 'pending'
}

export type ProjectTask = {
  __typename?: 'ProjectTask';
  active: Scalars['Boolean']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  responsible: User;
  startDate?: Maybe<Scalars['Date']['output']>;
  status: ProjectTaskStatus;
  uid: Scalars['ID']['output'];
};

/** ProjectTask mutations */
export type ProjectTaskMutations = {
  __typename?: 'ProjectTaskMutations';
  create: ProjectTask;
  update: ProjectTask;
};


/** ProjectTask mutations */
export type ProjectTaskMutationsCreateArgs = {
  data: CreateProjectTaskDataInput;
};


/** ProjectTask mutations */
export type ProjectTaskMutationsUpdateArgs = {
  data: UpdateProjectTaskDataInput;
  where: UpdateProjectTaskWhereInput;
};

/** ProjectTask queries */
export type ProjectTaskQueries = {
  __typename?: 'ProjectTaskQueries';
  list: ProjectTasksQueryResponse;
  one: ProjectTask;
};


/** ProjectTask queries */
export type ProjectTaskQueriesListArgs = {
  projectUid: Scalars['String']['input'];
  responsibleUid?: InputMaybe<Scalars['String']['input']>;
};


/** ProjectTask queries */
export type ProjectTaskQueriesOneArgs = {
  uid: Scalars['String']['input'];
};

export enum ProjectTaskStatus {
  Cancelled = 'cancelled',
  Done = 'done',
  InProgress = 'in_progress',
  Pending = 'pending',
  Reviewing = 'reviewing'
}

export type ProjectTasksQueryResponse = {
  __typename?: 'ProjectTasksQueryResponse';
  records: Array<ProjectTask>;
};

export type ProjectsQueryResponse = {
  __typename?: 'ProjectsQueryResponse';
  records: Array<Project>;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']['output']>;
  institution: InstitutionQueries;
  institutionalPlan: InstitutionalPlanQueries;
  objectiveODS: ObjectiveOdsQueries;
  program: ProgramQueries;
  project: ProjectQueries;
  projectTask: ProjectTaskQueries;
  user: UserQueries;
};

export type StringFilter = {
  contains: Scalars['String']['input'];
  endsWith: Scalars['String']['input'];
  equals: Scalars['String']['input'];
  startsWith: Scalars['String']['input'];
};

export type UpdateInstitutionDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  area?: InputMaybe<InstitutionArea>;
  level?: InputMaybe<InstitutionLevel>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInstitutionWhereInput = {
  id: Scalars['String']['input'];
};

export type UpdateInstitutionalPlanDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateInstitutionalPlanWhereInput = {
  uid: Scalars['String']['input'];
};

export type UpdateProgramDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  responsibleId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateProgramWhereInput = {
  id: Scalars['String']['input'];
};

export type UpdateProjectDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  responsibleUid?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<ProjectStatus>;
};

export type UpdateProjectTaskDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  responsibleUid?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<ProjectTaskStatus>;
};

export type UpdateProjectTaskWhereInput = {
  uid: Scalars['String']['input'];
};

export type UpdateProjectWhereInput = {
  id: Scalars['String']['input'];
};

export type UpdateUserDataInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  dni?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserWhereInput = {
  id: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  person: Person;
  uid: Scalars['ID']['output'];
};

/** User mutations */
export type UserMutations = {
  __typename?: 'UserMutations';
  create: User;
  update: User;
};


/** User mutations */
export type UserMutationsCreateArgs = {
  data: CreateUserDataInput;
};


/** User mutations */
export type UserMutationsUpdateArgs = {
  data: UpdateUserDataInput;
  where: UpdateUserWhereInput;
};

/** User queries */
export type UserQueries = {
  __typename?: 'UserQueries';
  list: UsersQueryResponse;
  one?: Maybe<User>;
};


/** User queries */
export type UserQueriesListArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<StringFilter>;
};


/** User queries */
export type UserQueriesOneArgs = {
  id: Scalars['String']['input'];
};

export type UsersQueryResponse = {
  __typename?: 'UsersQueryResponse';
  records: Array<User>;
};

export type CreateInstitution_UseSaveInstitutionMutationVariables = Exact<{
  data: CreateInstitutionDataInput;
}>;


export type CreateInstitution_UseSaveInstitutionMutation = { __typename?: 'Mutation', institution: { __typename?: 'InstitutionMutations', create: { __typename?: 'Institution', uid: string, name: string, area: InstitutionArea, level: InstitutionLevel, active: boolean } } };

export type GetInstitutions_UseGetInstitutionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetInstitutions_UseGetInstitutionQuery = { __typename?: 'Query', institution: { __typename?: 'InstitutionQueries', one?: { __typename?: 'Institution', uid: string, name: string, area: InstitutionArea, level: InstitutionLevel, active: boolean } | null } };

export type GetInstitutions_UseInstitutionListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInstitutions_UseInstitutionListQuery = { __typename?: 'Query', institution: { __typename?: 'InstitutionQueries', list: { __typename?: 'InstitutionsQueryResponse', records: Array<{ __typename?: 'Institution', uid: string, name: string }> } } };

export type UpdateInstitution_UseSaveInstitutionMutationVariables = Exact<{
  data: UpdateInstitutionDataInput;
  where: UpdateInstitutionWhereInput;
}>;


export type UpdateInstitution_UseSaveInstitutionMutation = { __typename?: 'Mutation', institution: { __typename?: 'InstitutionMutations', update: { __typename?: 'Institution', uid: string, name: string, area: InstitutionArea, level: InstitutionLevel, active: boolean } } };

export type CreateInstitutionalPlan_UseCreateInstitutionalPlanMutationVariables = Exact<{
  data: CreateInstitutionalPlanDataInput;
}>;


export type CreateInstitutionalPlan_UseCreateInstitutionalPlanMutation = { __typename?: 'Mutation', institutionalPlan: { __typename?: 'InstitutionalPlanMutations', create: { __typename?: 'InstitutionPlan', uid: string, name: string, active: boolean } } };

export type GetInstitutionalPlan_UseGetInstitutionalPlanQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetInstitutionalPlan_UseGetInstitutionalPlanQuery = { __typename?: 'Query', institutionalPlan: { __typename?: 'InstitutionalPlanQueries', one?: { __typename?: 'InstitutionPlan', uid: string, name: string, year: number, url: string } | null } };

export type GetInstitutionalPlan_UseInstitutionalPlanListQueryVariables = Exact<{
  institutionUid: Scalars['String']['input'];
}>;


export type GetInstitutionalPlan_UseInstitutionalPlanListQuery = { __typename?: 'Query', institutionalPlan: { __typename?: 'InstitutionalPlanQueries', list: { __typename?: 'InstitutionalPlansQueryResponse', records: Array<{ __typename?: 'InstitutionPlan', uid: string, name: string }> } } };

export type UpdateInstitutionalPlan_UseSaveInstitutionalPlanMutationVariables = Exact<{
  data: UpdateInstitutionalPlanDataInput;
  where: UpdateInstitutionalPlanWhereInput;
}>;


export type UpdateInstitutionalPlan_UseSaveInstitutionalPlanMutation = { __typename?: 'Mutation', institutionalPlan: { __typename?: 'InstitutionalPlanMutations', update: { __typename?: 'InstitutionPlan', uid: string, name: string } } };

export type ObjectiveOds_UseOdsListQueryVariables = Exact<{ [key: string]: never; }>;


export type ObjectiveOds_UseOdsListQuery = { __typename?: 'Query', objectiveODS: { __typename?: 'ObjectiveODSQueries', list: { __typename?: 'ObjectiveODSQueryResponse', records: Array<{ __typename?: 'ObjectiveODS', uid: string, name: string, description: string, active: boolean }> } } };

export type CreateProgram_UseCreateProgramMutationVariables = Exact<{
  data: CreateProgramDataInput;
}>;


export type CreateProgram_UseCreateProgramMutation = { __typename?: 'Mutation', program: { __typename?: 'ProgramMutations', create: { __typename?: 'Program', uid: string, name: string, active: boolean } } };

export type GetPrograms_UseGetProgramQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPrograms_UseGetProgramQuery = { __typename?: 'Query', program: { __typename?: 'ProgramQueries', one?: { __typename?: 'Program', uid: string, name: string, description?: string | null, active: boolean, responsible: { __typename?: 'User', uid: string } } | null } };

export type GetProgramList_UseProgramListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProgramList_UseProgramListQuery = { __typename?: 'Query', program: { __typename?: 'ProgramQueries', list: { __typename?: 'ProgramsQueryResponse', records: Array<{ __typename?: 'Program', uid: string, name: string }> } } };

export type UpdateProgram_UseUpdateProgramMutationVariables = Exact<{
  data: UpdateProgramDataInput;
  where: UpdateProgramWhereInput;
}>;


export type UpdateProgram_UseUpdateProgramMutation = { __typename?: 'Mutation', program: { __typename?: 'ProgramMutations', update: { __typename?: 'Program', uid: string, name: string, description?: string | null, active: boolean, responsible: { __typename?: 'User', uid: string } } } };

export type CreateProject_UseCreateProjectMutationVariables = Exact<{
  data: CreateProjectDataInput;
}>;


export type CreateProject_UseCreateProjectMutation = { __typename?: 'Mutation', project: { __typename?: 'ProjectMutations', create: { __typename?: 'Project', uid: string, name: string, active: boolean } } };

export type GetProjects_UseGetProjectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProjects_UseGetProjectQuery = { __typename?: 'Query', project: { __typename?: 'ProjectQueries', one?: { __typename?: 'Project', uid: string, name: string, description?: string | null, status: ProjectStatus, startDate?: any | null, endDate?: any | null, active: boolean, program: { __typename?: 'Program', uid: string }, responsible: { __typename?: 'User', uid: string, name: string } } | null } };

export type GetProjectList_UseProjectListQueryVariables = Exact<{
  programId: Scalars['String']['input'];
}>;


export type GetProjectList_UseProjectListQuery = { __typename?: 'Query', project: { __typename?: 'ProjectQueries', list: { __typename?: 'ProjectsQueryResponse', records: Array<{ __typename?: 'Project', uid: string, name: string, program: { __typename?: 'Program', uid: string } }> } } };

export type UpdateProject_UseUpdateProjectMutationVariables = Exact<{
  data: UpdateProjectDataInput;
  where: UpdateProjectWhereInput;
}>;


export type UpdateProject_UseUpdateProjectMutation = { __typename?: 'Mutation', project: { __typename?: 'ProjectMutations', update: { __typename?: 'Project', uid: string, name: string, description?: string | null, active: boolean, responsible: { __typename?: 'User', uid: string } } } };

export type ProjectTask_UseCreateProjectTaskMutationVariables = Exact<{
  data: CreateProjectTaskDataInput;
}>;


export type ProjectTask_UseCreateProjectTaskMutation = { __typename?: 'Mutation', projectTask: { __typename?: 'ProjectTaskMutations', create: { __typename?: 'ProjectTask', uid: string, name: string, description?: string | null, active: boolean, responsible: { __typename?: 'User', uid: string, name: string } } } };

export type ProjectTask_UseGetProjectTaskQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ProjectTask_UseGetProjectTaskQuery = { __typename?: 'Query', projectTask: { __typename?: 'ProjectTaskQueries', one: { __typename?: 'ProjectTask', uid: string, name: string, description?: string | null, status: ProjectTaskStatus, startDate?: any | null, endDate?: any | null, active: boolean, responsible: { __typename?: 'User', uid: string, name: string } } } };

export type ProjectTask_UseProjectTaskListQueryVariables = Exact<{
  projectUid: Scalars['String']['input'];
}>;


export type ProjectTask_UseProjectTaskListQuery = { __typename?: 'Query', projectTask: { __typename?: 'ProjectTaskQueries', list: { __typename?: 'ProjectTasksQueryResponse', records: Array<{ __typename?: 'ProjectTask', uid: string, name: string, description?: string | null, status: ProjectTaskStatus, startDate?: any | null, endDate?: any | null, responsible: { __typename?: 'User', uid: string, name: string } }> } } };

export type ProjectTask_UseUpdateProjectTaskMutationVariables = Exact<{
  data: UpdateProjectTaskDataInput;
  where: UpdateProjectTaskWhereInput;
}>;


export type ProjectTask_UseUpdateProjectTaskMutation = { __typename?: 'Mutation', projectTask: { __typename?: 'ProjectTaskMutations', update: { __typename?: 'ProjectTask', uid: string, name: string, description?: string | null, status: ProjectTaskStatus, active: boolean, responsible: { __typename?: 'User', uid: string, name: string } } } };

export type CreateUser_UseCreateUserMutationVariables = Exact<{
  data: CreateUserDataInput;
}>;


export type CreateUser_UseCreateUserMutation = { __typename?: 'Mutation', user: { __typename?: 'UserMutations', create: { __typename?: 'User', uid: string, name: string, active: boolean, person: { __typename?: 'Person', firstName: string, lastName: string, dni: string } } } };

export type GetUsers_UseGetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUsers_UseGetUserQuery = { __typename?: 'Query', user: { __typename?: 'UserQueries', one?: { __typename?: 'User', uid: string, name: string, active: boolean, person: { __typename?: 'Person', dni: string, firstName: string, lastName: string } } | null } };

export type UpdateUser_UseUpdateUserMutationVariables = Exact<{
  data: UpdateUserDataInput;
  where: UpdateUserWhereInput;
}>;


export type UpdateUser_UseUpdateUserMutation = { __typename?: 'Mutation', user: { __typename?: 'UserMutations', update: { __typename?: 'User', uid: string, name: string, active: boolean, person: { __typename?: 'Person', firstName: string, lastName: string, dni: string } } } };

export type GetUsers_UseUserListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsers_UseUserListQuery = { __typename?: 'Query', user: { __typename?: 'UserQueries', list: { __typename?: 'UsersQueryResponse', records: Array<{ __typename?: 'User', uid: string, name: string, active: boolean, person: { __typename?: 'Person', firstName: string, lastName: string } }> } } };


export const CreateInstitution_UseSaveInstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInstitution_useSaveInstitution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInstitutionDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CreateInstitution_UseSaveInstitutionMutation, CreateInstitution_UseSaveInstitutionMutationVariables>;
export const GetInstitutions_UseGetInstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstitutions_useGetInstitution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<GetInstitutions_UseGetInstitutionQuery, GetInstitutions_UseGetInstitutionQueryVariables>;
export const GetInstitutions_UseInstitutionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstitutions_useInstitutionList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetInstitutions_UseInstitutionListQuery, GetInstitutions_UseInstitutionListQueryVariables>;
export const UpdateInstitution_UseSaveInstitutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInstitution_useSaveInstitution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInstitutionDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInstitutionWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateInstitution_UseSaveInstitutionMutation, UpdateInstitution_UseSaveInstitutionMutationVariables>;
export const CreateInstitutionalPlan_UseCreateInstitutionalPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInstitutionalPlan_useCreateInstitutionalPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInstitutionalPlanDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionalPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CreateInstitutionalPlan_UseCreateInstitutionalPlanMutation, CreateInstitutionalPlan_UseCreateInstitutionalPlanMutationVariables>;
export const GetInstitutionalPlan_UseGetInstitutionalPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstitutionalPlan_useGetInstitutionalPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionalPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetInstitutionalPlan_UseGetInstitutionalPlanQuery, GetInstitutionalPlan_UseGetInstitutionalPlanQueryVariables>;
export const GetInstitutionalPlan_UseInstitutionalPlanListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstitutionalPlan_useInstitutionalPlanList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"institutionUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionalPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"institutionUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"institutionUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetInstitutionalPlan_UseInstitutionalPlanListQuery, GetInstitutionalPlan_UseInstitutionalPlanListQueryVariables>;
export const UpdateInstitutionalPlan_UseSaveInstitutionalPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInstitutionalPlan_useSaveInstitutionalPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInstitutionalPlanDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInstitutionalPlanWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"institutionalPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateInstitutionalPlan_UseSaveInstitutionalPlanMutation, UpdateInstitutionalPlan_UseSaveInstitutionalPlanMutationVariables>;
export const ObjectiveOds_UseOdsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectiveODS_useODSList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"objectiveODS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ObjectiveOds_UseOdsListQuery, ObjectiveOds_UseOdsListQueryVariables>;
export const CreateProgram_UseCreateProgramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProgram_useCreateProgram"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProgramDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProgram_UseCreateProgramMutation, CreateProgram_UseCreateProgramMutationVariables>;
export const GetPrograms_UseGetProgramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPrograms_useGetProgram"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<GetPrograms_UseGetProgramQuery, GetPrograms_UseGetProgramQueryVariables>;
export const GetProgramList_UseProgramListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProgramList_useProgramList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProgramList_UseProgramListQuery, GetProgramList_UseProgramListQueryVariables>;
export const UpdateProgram_UseUpdateProgramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProgram_useUpdateProgram"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProgramDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProgramWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProgram_UseUpdateProgramMutation, UpdateProgram_UseUpdateProgramMutationVariables>;
export const CreateProject_UseCreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject_useCreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProject_UseCreateProjectMutation, CreateProject_UseCreateProjectMutationVariables>;
export const GetProjects_UseGetProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjects_useGetProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjects_UseGetProjectQuery, GetProjects_UseGetProjectQueryVariables>;
export const GetProjectList_UseProjectListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectList_useProjectList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"programId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"programId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"programId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"program"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectList_UseProjectListQuery, GetProjectList_UseProjectListQueryVariables>;
export const UpdateProject_UseUpdateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProject_useUpdateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProject_UseUpdateProjectMutation, UpdateProject_UseUpdateProjectMutationVariables>;
export const ProjectTask_UseCreateProjectTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ProjectTask_useCreateProjectTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectTaskDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectTask_UseCreateProjectTaskMutation, ProjectTask_UseCreateProjectTaskMutationVariables>;
export const ProjectTask_UseGetProjectTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectTask_useGetProjectTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectTask_UseGetProjectTaskQuery, ProjectTask_UseGetProjectTaskQueryVariables>;
export const ProjectTask_UseProjectTaskListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectTask_useProjectTaskList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectUid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectUid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectUid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProjectTask_UseProjectTaskListQuery, ProjectTask_UseProjectTaskListQueryVariables>;
export const ProjectTask_UseUpdateProjectTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ProjectTask_useUpdateProjectTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectTaskDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectTaskWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectTask_UseUpdateProjectTaskMutation, ProjectTask_UseUpdateProjectTaskMutationVariables>;
export const CreateUser_UseCreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser_useCreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"create"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dni"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUser_UseCreateUserMutation, CreateUser_UseCreateUserMutationVariables>;
export const GetUsers_UseGetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers_useGetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dni"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsers_UseGetUserQuery, GetUsers_UseGetUserQueryVariables>;
export const UpdateUser_UseUpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser_useUpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserDataInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"dni"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUser_UseUpdateUserMutation, UpdateUser_UseUpdateUserMutationVariables>;
export const GetUsers_UseUserListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers_useUserList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUsers_UseUserListQuery, GetUsers_UseUserListQueryVariables>;