/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Alignment_useInstitutionalAlignments(\n    $institutionalObjectiveUid: String!\n  ) {\n    institutionalObjective {\n      one(uid: $institutionalObjectiveUid) {\n        uid\n        alignments {\n          id\n          institutionalObjectiveUid\n          pndObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n": typeof types.Alignment_UseInstitutionalAlignmentsDocument,
    "\n  query Alignment_usePndAlignments($pndObjectiveUid: String!) {\n    objectivePND {\n      one(uid: $pndObjectiveUid) {\n        uid\n        alignmentsToODS {\n          id\n          pndObjectiveUid\n          odsObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n": typeof types.Alignment_UsePndAlignmentsDocument,
    "\n  mutation Alignment_useCreateInstitutionalToPND(\n    $input: CreateAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      createInstitutionalToPND(input: $input) {\n        id\n        institutionalObjectiveUid\n        pndObjectiveUid\n        createdAt\n      }\n    }\n  }\n": typeof types.Alignment_UseCreateInstitutionalToPndDocument,
    "\n  mutation Alignment_useDeleteInstitutionalToPND(\n    $input: DeleteAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      deleteInstitutionalToPND(input: $input)\n    }\n  }\n": typeof types.Alignment_UseDeleteInstitutionalToPndDocument,
    "\n  mutation Alignment_useCreatePNDToODS(\n    $input: CreateAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      createPNDToODS(input: $input) {\n        id\n        pndObjectiveUid\n        odsObjectiveUid\n        createdAt\n      }\n    }\n  }\n": typeof types.Alignment_UseCreatePndToOdsDocument,
    "\n  mutation Alignment_useDeletePNDToODS(\n    $input: DeleteAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      deletePNDToODS(input: $input)\n    }\n  }\n": typeof types.Alignment_UseDeletePndToOdsDocument,
    "\n  mutation CreateInstitution_useSaveInstitution ($data: CreateInstitutionDataInput!) {\n    institution {\n      create (data: $data) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": typeof types.CreateInstitution_UseSaveInstitutionDocument,
    "\n  query GetInstitutions_useGetInstitution ($id: String!) {\n    institution {\n      one (id: $id) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": typeof types.GetInstitutions_UseGetInstitutionDocument,
    "\n  query GetInstitutions_useInstitutionList {\n    institution {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetInstitutions_UseInstitutionListDocument,
    "\n  mutation UpdateInstitution_useSaveInstitution ($data: UpdateInstitutionDataInput!, $where: UpdateInstitutionWhereInput!) {\n    institution {\n      update (data: $data, where: $where) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": typeof types.UpdateInstitution_UseSaveInstitutionDocument,
    "\n  mutation CreateInstitutionalObjective_UseCreateInstitutionalObjective($data: CreateInstitutionalObjectiveDataInput!) {\n    institutionalObjective {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": typeof types.CreateInstitutionalObjective_UseCreateInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseCreateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": typeof types.InstitutionalObjectiveList_UseCreateInstitutionalObjectiveDocument,
    "\n  query GetInstitutionalObjective_UseGetInstitutionalObjective($uid: String!) {\n    institutionalObjective {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n        institution {\n          uid\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetInstitutionalObjective_UseGetInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseInstitutionalObjectiveList($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n": typeof types.InstitutionalObjectiveList_UseInstitutionalObjectiveListDocument,
    "\n  mutation UpdateInstitutionalObjective_UseUpdateInstitutionalObjective(\n    $where: UpdateInstitutionalObjectiveWhereInput!\n    $data: UpdateInstitutionalObjectiveDataInput!\n  ) {\n    institutionalObjective {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n": typeof types.UpdateInstitutionalObjective_UseUpdateInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseUpdateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": typeof types.InstitutionalObjectiveList_UseUpdateInstitutionalObjectiveDocument,
    "\n  mutation CreateInstitutionalPlan_useCreateInstitutionalPlan ($data: CreateInstitutionalPlanDataInput!) {\n    institutionalPlan {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": typeof types.CreateInstitutionalPlan_UseCreateInstitutionalPlanDocument,
    "\n  query GetInstitutionalPlan_useGetInstitutionalPlan ($uid: String!) {\n    institutionalPlan {\n      one (uid: $uid) {\n        uid\n        name\n        year\n        url\n      }\n    }\n  }\n": typeof types.GetInstitutionalPlan_UseGetInstitutionalPlanDocument,
    "\n  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!) {\n    institutionalPlan {\n      list (institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetInstitutionalPlan_UseInstitutionalPlanListDocument,
    "\n  mutation UpdateInstitutionalPlan_useSaveInstitutionalPlan ($data: UpdateInstitutionalPlanDataInput!, $where: UpdateInstitutionalPlanWhereInput!) {\n    institutionalPlan {\n      update (data: $data, where: $where) {\n        uid\n        name\n      }\n    }\n  }\n": typeof types.UpdateInstitutionalPlan_UseSaveInstitutionalPlanDocument,
    "\n  query ObjectiveODS_useODSList {\n    objectiveODS {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": typeof types.ObjectiveOds_UseOdsListDocument,
    "\n  mutation ObjectivePND_usePNDCreate($data: CreateObjectivePNDDataInput!) {\n    objectivePND {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": typeof types.ObjectivePnd_UsePndCreateDocument,
    "\n  mutation ObjectivePND_usePNDDelete($input: DeleteObjectivePNDInput!) {\n    objectivePND {\n      delete(input: $input)\n    }\n  }\n": typeof types.ObjectivePnd_UsePndDeleteDocument,
    "\n  query ObjectivePND_usePNDList {\n    objectivePND {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n": typeof types.ObjectivePnd_UsePndListDocument,
    "\n  query ObjectivePND_usePNDOne($uid: String!) {\n    objectivePND {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n": typeof types.ObjectivePnd_UsePndOneDocument,
    "\n  mutation ObjectivePND_usePNDUpdate(\n    $where: UpdateObjectivePNDWhereInput!\n    $data: UpdateObjectivePNDDataInput!\n  ) {\n    objectivePND {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": typeof types.ObjectivePnd_UsePndUpdateDocument,
    "\n  mutation CreateProgram_useCreateProgram ($data: CreateProgramDataInput!) {\n    program {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": typeof types.CreateProgram_UseCreateProgramDocument,
    "\n  query GetPrograms_useGetProgram ($id: String!) {\n    program {\n      one (id: $id) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": typeof types.GetPrograms_UseGetProgramDocument,
    "\n  query GetProgramList_useProgramList {\n    program {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetProgramList_UseProgramListDocument,
    "\n  mutation UpdateProgram_useUpdateProgram ($data: UpdateProgramDataInput!, $where: UpdateProgramWhereInput!) {\n    program {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": typeof types.UpdateProgram_UseUpdateProgramDocument,
    "\n  mutation CreateProject_useCreateProject ($data: CreateProjectDataInput!) {\n    project {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": typeof types.CreateProject_UseCreateProjectDocument,
    "\n  query GetProjects_useGetProject ($id: String!) {\n    project {\n      one (id: $id) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        program {\n          uid\n        }\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": typeof types.GetProjects_UseGetProjectDocument,
    "\n  query GetProjectList_useProjectList ($programId: String!) {\n    project {\n      list (programId: $programId) {\n        records {\n          uid\n          name\n          program {\n            uid\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetProjectList_UseProjectListDocument,
    "\n  mutation UpdateProject_useUpdateProject ($data: UpdateProjectDataInput!, $where: UpdateProjectWhereInput!) {\n    project {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": typeof types.UpdateProject_UseUpdateProjectDocument,
    "\n  mutation ProjectTask_useCreateProjectTask ($data: CreateProjectTaskDataInput!) {\n    projectTask {\n      create (data: $data) {\n        uid\n        name\n        description\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": typeof types.ProjectTask_UseCreateProjectTaskDocument,
    "\n  query ProjectTask_useGetProjectTask ($uid: String!) {\n    projectTask {\n      one (uid: $uid) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": typeof types.ProjectTask_UseGetProjectTaskDocument,
    "\n  query ProjectTask_useProjectTaskList ($projectUid: String!) {\n    projectTask {\n      list (projectUid: $projectUid) {\n        records {\n          uid\n          name\n          description\n          status\n          startDate\n          endDate\n          responsible {\n            uid\n            name\n          }\n        }\n      }\n    }\n  }\n": typeof types.ProjectTask_UseProjectTaskListDocument,
    "\n  mutation ProjectTask_useUpdateProjectTask ($data: UpdateProjectTaskDataInput!, $where: UpdateProjectTaskWhereInput!) {\n    projectTask {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        status\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": typeof types.ProjectTask_UseUpdateProjectTaskDocument,
    "\n  mutation CreateUser_useCreateUser ($data: CreateUserDataInput!) {\n    user {\n      create (data: $data) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n": typeof types.CreateUser_UseCreateUserDocument,
    "\n  query GetUsers_useGetUser ($id: String!) {\n    user {\n      one (id: $id) {\n        uid\n        name\n        person {\n          dni\n          firstName\n          lastName\n        }\n        active\n      }\n    }\n  }\n": typeof types.GetUsers_UseGetUserDocument,
    "\n  mutation UpdateUser_useUpdateUser ($data: UpdateUserDataInput!, $where: UpdateUserWhereInput!) {\n    user {\n      update (data: $data, where: $where) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n": typeof types.UpdateUser_UseUpdateUserDocument,
    "\n  query GetUsers_useUserList {\n    user {\n      list {\n        records {\n          uid\n          name\n          person {\n            firstName\n            lastName\n          }\n          active\n        }\n      }\n    }\n  }\n": typeof types.GetUsers_UseUserListDocument,
};
const documents: Documents = {
    "\n  query Alignment_useInstitutionalAlignments(\n    $institutionalObjectiveUid: String!\n  ) {\n    institutionalObjective {\n      one(uid: $institutionalObjectiveUid) {\n        uid\n        alignments {\n          id\n          institutionalObjectiveUid\n          pndObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n": types.Alignment_UseInstitutionalAlignmentsDocument,
    "\n  query Alignment_usePndAlignments($pndObjectiveUid: String!) {\n    objectivePND {\n      one(uid: $pndObjectiveUid) {\n        uid\n        alignmentsToODS {\n          id\n          pndObjectiveUid\n          odsObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n": types.Alignment_UsePndAlignmentsDocument,
    "\n  mutation Alignment_useCreateInstitutionalToPND(\n    $input: CreateAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      createInstitutionalToPND(input: $input) {\n        id\n        institutionalObjectiveUid\n        pndObjectiveUid\n        createdAt\n      }\n    }\n  }\n": types.Alignment_UseCreateInstitutionalToPndDocument,
    "\n  mutation Alignment_useDeleteInstitutionalToPND(\n    $input: DeleteAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      deleteInstitutionalToPND(input: $input)\n    }\n  }\n": types.Alignment_UseDeleteInstitutionalToPndDocument,
    "\n  mutation Alignment_useCreatePNDToODS(\n    $input: CreateAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      createPNDToODS(input: $input) {\n        id\n        pndObjectiveUid\n        odsObjectiveUid\n        createdAt\n      }\n    }\n  }\n": types.Alignment_UseCreatePndToOdsDocument,
    "\n  mutation Alignment_useDeletePNDToODS(\n    $input: DeleteAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      deletePNDToODS(input: $input)\n    }\n  }\n": types.Alignment_UseDeletePndToOdsDocument,
    "\n  mutation CreateInstitution_useSaveInstitution ($data: CreateInstitutionDataInput!) {\n    institution {\n      create (data: $data) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": types.CreateInstitution_UseSaveInstitutionDocument,
    "\n  query GetInstitutions_useGetInstitution ($id: String!) {\n    institution {\n      one (id: $id) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": types.GetInstitutions_UseGetInstitutionDocument,
    "\n  query GetInstitutions_useInstitutionList {\n    institution {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": types.GetInstitutions_UseInstitutionListDocument,
    "\n  mutation UpdateInstitution_useSaveInstitution ($data: UpdateInstitutionDataInput!, $where: UpdateInstitutionWhereInput!) {\n    institution {\n      update (data: $data, where: $where) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n": types.UpdateInstitution_UseSaveInstitutionDocument,
    "\n  mutation CreateInstitutionalObjective_UseCreateInstitutionalObjective($data: CreateInstitutionalObjectiveDataInput!) {\n    institutionalObjective {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": types.CreateInstitutionalObjective_UseCreateInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseCreateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": types.InstitutionalObjectiveList_UseCreateInstitutionalObjectiveDocument,
    "\n  query GetInstitutionalObjective_UseGetInstitutionalObjective($uid: String!) {\n    institutionalObjective {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n        institution {\n          uid\n          name\n        }\n      }\n    }\n  }\n": types.GetInstitutionalObjective_UseGetInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseInstitutionalObjectiveList($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n": types.InstitutionalObjectiveList_UseInstitutionalObjectiveListDocument,
    "\n  mutation UpdateInstitutionalObjective_UseUpdateInstitutionalObjective(\n    $where: UpdateInstitutionalObjectiveWhereInput!\n    $data: UpdateInstitutionalObjectiveDataInput!\n  ) {\n    institutionalObjective {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n": types.UpdateInstitutionalObjective_UseUpdateInstitutionalObjectiveDocument,
    "\n  query InstitutionalObjectiveList_UseUpdateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": types.InstitutionalObjectiveList_UseUpdateInstitutionalObjectiveDocument,
    "\n  mutation CreateInstitutionalPlan_useCreateInstitutionalPlan ($data: CreateInstitutionalPlanDataInput!) {\n    institutionalPlan {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": types.CreateInstitutionalPlan_UseCreateInstitutionalPlanDocument,
    "\n  query GetInstitutionalPlan_useGetInstitutionalPlan ($uid: String!) {\n    institutionalPlan {\n      one (uid: $uid) {\n        uid\n        name\n        year\n        url\n      }\n    }\n  }\n": types.GetInstitutionalPlan_UseGetInstitutionalPlanDocument,
    "\n  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!) {\n    institutionalPlan {\n      list (institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": types.GetInstitutionalPlan_UseInstitutionalPlanListDocument,
    "\n  mutation UpdateInstitutionalPlan_useSaveInstitutionalPlan ($data: UpdateInstitutionalPlanDataInput!, $where: UpdateInstitutionalPlanWhereInput!) {\n    institutionalPlan {\n      update (data: $data, where: $where) {\n        uid\n        name\n      }\n    }\n  }\n": types.UpdateInstitutionalPlan_UseSaveInstitutionalPlanDocument,
    "\n  query ObjectiveODS_useODSList {\n    objectiveODS {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n": types.ObjectiveOds_UseOdsListDocument,
    "\n  mutation ObjectivePND_usePNDCreate($data: CreateObjectivePNDDataInput!) {\n    objectivePND {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": types.ObjectivePnd_UsePndCreateDocument,
    "\n  mutation ObjectivePND_usePNDDelete($input: DeleteObjectivePNDInput!) {\n    objectivePND {\n      delete(input: $input)\n    }\n  }\n": types.ObjectivePnd_UsePndDeleteDocument,
    "\n  query ObjectivePND_usePNDList {\n    objectivePND {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n": types.ObjectivePnd_UsePndListDocument,
    "\n  query ObjectivePND_usePNDOne($uid: String!) {\n    objectivePND {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n": types.ObjectivePnd_UsePndOneDocument,
    "\n  mutation ObjectivePND_usePNDUpdate(\n    $where: UpdateObjectivePNDWhereInput!\n    $data: UpdateObjectivePNDDataInput!\n  ) {\n    objectivePND {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n": types.ObjectivePnd_UsePndUpdateDocument,
    "\n  mutation CreateProgram_useCreateProgram ($data: CreateProgramDataInput!) {\n    program {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": types.CreateProgram_UseCreateProgramDocument,
    "\n  query GetPrograms_useGetProgram ($id: String!) {\n    program {\n      one (id: $id) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": types.GetPrograms_UseGetProgramDocument,
    "\n  query GetProgramList_useProgramList {\n    program {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n": types.GetProgramList_UseProgramListDocument,
    "\n  mutation UpdateProgram_useUpdateProgram ($data: UpdateProgramDataInput!, $where: UpdateProgramWhereInput!) {\n    program {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": types.UpdateProgram_UseUpdateProgramDocument,
    "\n  mutation CreateProject_useCreateProject ($data: CreateProjectDataInput!) {\n    project {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n": types.CreateProject_UseCreateProjectDocument,
    "\n  query GetProjects_useGetProject ($id: String!) {\n    project {\n      one (id: $id) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        program {\n          uid\n        }\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": types.GetProjects_UseGetProjectDocument,
    "\n  query GetProjectList_useProjectList ($programId: String!) {\n    project {\n      list (programId: $programId) {\n        records {\n          uid\n          name\n          program {\n            uid\n          }\n        }\n      }\n    }\n  }\n": types.GetProjectList_UseProjectListDocument,
    "\n  mutation UpdateProject_useUpdateProject ($data: UpdateProjectDataInput!, $where: UpdateProjectWhereInput!) {\n    project {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n": types.UpdateProject_UseUpdateProjectDocument,
    "\n  mutation ProjectTask_useCreateProjectTask ($data: CreateProjectTaskDataInput!) {\n    projectTask {\n      create (data: $data) {\n        uid\n        name\n        description\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": types.ProjectTask_UseCreateProjectTaskDocument,
    "\n  query ProjectTask_useGetProjectTask ($uid: String!) {\n    projectTask {\n      one (uid: $uid) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": types.ProjectTask_UseGetProjectTaskDocument,
    "\n  query ProjectTask_useProjectTaskList ($projectUid: String!) {\n    projectTask {\n      list (projectUid: $projectUid) {\n        records {\n          uid\n          name\n          description\n          status\n          startDate\n          endDate\n          responsible {\n            uid\n            name\n          }\n        }\n      }\n    }\n  }\n": types.ProjectTask_UseProjectTaskListDocument,
    "\n  mutation ProjectTask_useUpdateProjectTask ($data: UpdateProjectTaskDataInput!, $where: UpdateProjectTaskWhereInput!) {\n    projectTask {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        status\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n": types.ProjectTask_UseUpdateProjectTaskDocument,
    "\n  mutation CreateUser_useCreateUser ($data: CreateUserDataInput!) {\n    user {\n      create (data: $data) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n": types.CreateUser_UseCreateUserDocument,
    "\n  query GetUsers_useGetUser ($id: String!) {\n    user {\n      one (id: $id) {\n        uid\n        name\n        person {\n          dni\n          firstName\n          lastName\n        }\n        active\n      }\n    }\n  }\n": types.GetUsers_UseGetUserDocument,
    "\n  mutation UpdateUser_useUpdateUser ($data: UpdateUserDataInput!, $where: UpdateUserWhereInput!) {\n    user {\n      update (data: $data, where: $where) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n": types.UpdateUser_UseUpdateUserDocument,
    "\n  query GetUsers_useUserList {\n    user {\n      list {\n        records {\n          uid\n          name\n          person {\n            firstName\n            lastName\n          }\n          active\n        }\n      }\n    }\n  }\n": types.GetUsers_UseUserListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Alignment_useInstitutionalAlignments(\n    $institutionalObjectiveUid: String!\n  ) {\n    institutionalObjective {\n      one(uid: $institutionalObjectiveUid) {\n        uid\n        alignments {\n          id\n          institutionalObjectiveUid\n          pndObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Alignment_useInstitutionalAlignments(\n    $institutionalObjectiveUid: String!\n  ) {\n    institutionalObjective {\n      one(uid: $institutionalObjectiveUid) {\n        uid\n        alignments {\n          id\n          institutionalObjectiveUid\n          pndObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Alignment_usePndAlignments($pndObjectiveUid: String!) {\n    objectivePND {\n      one(uid: $pndObjectiveUid) {\n        uid\n        alignmentsToODS {\n          id\n          pndObjectiveUid\n          odsObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Alignment_usePndAlignments($pndObjectiveUid: String!) {\n    objectivePND {\n      one(uid: $pndObjectiveUid) {\n        uid\n        alignmentsToODS {\n          id\n          pndObjectiveUid\n          odsObjectiveUid\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Alignment_useCreateInstitutionalToPND(\n    $input: CreateAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      createInstitutionalToPND(input: $input) {\n        id\n        institutionalObjectiveUid\n        pndObjectiveUid\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Alignment_useCreateInstitutionalToPND(\n    $input: CreateAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      createInstitutionalToPND(input: $input) {\n        id\n        institutionalObjectiveUid\n        pndObjectiveUid\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Alignment_useDeleteInstitutionalToPND(\n    $input: DeleteAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      deleteInstitutionalToPND(input: $input)\n    }\n  }\n"): (typeof documents)["\n  mutation Alignment_useDeleteInstitutionalToPND(\n    $input: DeleteAlignmentInstitutionalToPNDInput!\n  ) {\n    alignment {\n      deleteInstitutionalToPND(input: $input)\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Alignment_useCreatePNDToODS(\n    $input: CreateAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      createPNDToODS(input: $input) {\n        id\n        pndObjectiveUid\n        odsObjectiveUid\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Alignment_useCreatePNDToODS(\n    $input: CreateAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      createPNDToODS(input: $input) {\n        id\n        pndObjectiveUid\n        odsObjectiveUid\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Alignment_useDeletePNDToODS(\n    $input: DeleteAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      deletePNDToODS(input: $input)\n    }\n  }\n"): (typeof documents)["\n  mutation Alignment_useDeletePNDToODS(\n    $input: DeleteAlignmentPNDToODSInput!\n  ) {\n    alignment {\n      deletePNDToODS(input: $input)\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateInstitution_useSaveInstitution ($data: CreateInstitutionDataInput!) {\n    institution {\n      create (data: $data) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateInstitution_useSaveInstitution ($data: CreateInstitutionDataInput!) {\n    institution {\n      create (data: $data) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutions_useGetInstitution ($id: String!) {\n    institution {\n      one (id: $id) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInstitutions_useGetInstitution ($id: String!) {\n    institution {\n      one (id: $id) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutions_useInstitutionList {\n    institution {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInstitutions_useInstitutionList {\n    institution {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateInstitution_useSaveInstitution ($data: UpdateInstitutionDataInput!, $where: UpdateInstitutionWhereInput!) {\n    institution {\n      update (data: $data, where: $where) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateInstitution_useSaveInstitution ($data: UpdateInstitutionDataInput!, $where: UpdateInstitutionWhereInput!) {\n    institution {\n      update (data: $data, where: $where) {\n        uid\n        name\n        area\n        level\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateInstitutionalObjective_UseCreateInstitutionalObjective($data: CreateInstitutionalObjectiveDataInput!) {\n    institutionalObjective {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateInstitutionalObjective_UseCreateInstitutionalObjective($data: CreateInstitutionalObjectiveDataInput!) {\n    institutionalObjective {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InstitutionalObjectiveList_UseCreateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query InstitutionalObjectiveList_UseCreateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutionalObjective_UseGetInstitutionalObjective($uid: String!) {\n    institutionalObjective {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n        institution {\n          uid\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInstitutionalObjective_UseGetInstitutionalObjective($uid: String!) {\n    institutionalObjective {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n        institution {\n          uid\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InstitutionalObjectiveList_UseInstitutionalObjectiveList($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query InstitutionalObjectiveList_UseInstitutionalObjectiveList($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateInstitutionalObjective_UseUpdateInstitutionalObjective(\n    $where: UpdateInstitutionalObjectiveWhereInput!\n    $data: UpdateInstitutionalObjectiveDataInput!\n  ) {\n    institutionalObjective {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateInstitutionalObjective_UseUpdateInstitutionalObjective(\n    $where: UpdateInstitutionalObjectiveWhereInput!\n    $data: UpdateInstitutionalObjectiveDataInput!\n  ) {\n    institutionalObjective {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InstitutionalObjectiveList_UseUpdateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query InstitutionalObjectiveList_UseUpdateInstitutionalObjective($active: Boolean, $institutionUid: String) {\n    institutionalObjective {\n      list(active: $active, institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateInstitutionalPlan_useCreateInstitutionalPlan ($data: CreateInstitutionalPlanDataInput!) {\n    institutionalPlan {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateInstitutionalPlan_useCreateInstitutionalPlan ($data: CreateInstitutionalPlanDataInput!) {\n    institutionalPlan {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutionalPlan_useGetInstitutionalPlan ($uid: String!) {\n    institutionalPlan {\n      one (uid: $uid) {\n        uid\n        name\n        year\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInstitutionalPlan_useGetInstitutionalPlan ($uid: String!) {\n    institutionalPlan {\n      one (uid: $uid) {\n        uid\n        name\n        year\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!) {\n    institutionalPlan {\n      list (institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!) {\n    institutionalPlan {\n      list (institutionUid: $institutionUid) {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateInstitutionalPlan_useSaveInstitutionalPlan ($data: UpdateInstitutionalPlanDataInput!, $where: UpdateInstitutionalPlanWhereInput!) {\n    institutionalPlan {\n      update (data: $data, where: $where) {\n        uid\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateInstitutionalPlan_useSaveInstitutionalPlan ($data: UpdateInstitutionalPlanDataInput!, $where: UpdateInstitutionalPlanWhereInput!) {\n    institutionalPlan {\n      update (data: $data, where: $where) {\n        uid\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ObjectiveODS_useODSList {\n    objectiveODS {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ObjectiveODS_useODSList {\n    objectiveODS {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ObjectivePND_usePNDCreate($data: CreateObjectivePNDDataInput!) {\n    objectivePND {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ObjectivePND_usePNDCreate($data: CreateObjectivePNDDataInput!) {\n    objectivePND {\n      create(data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ObjectivePND_usePNDDelete($input: DeleteObjectivePNDInput!) {\n    objectivePND {\n      delete(input: $input)\n    }\n  }\n"): (typeof documents)["\n  mutation ObjectivePND_usePNDDelete($input: DeleteObjectivePNDInput!) {\n    objectivePND {\n      delete(input: $input)\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ObjectivePND_usePNDList {\n    objectivePND {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ObjectivePND_usePNDList {\n    objectivePND {\n      list {\n        records {\n          uid\n          name\n          description\n          active\n          deletedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ObjectivePND_usePNDOne($uid: String!) {\n    objectivePND {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query ObjectivePND_usePNDOne($uid: String!) {\n    objectivePND {\n      one(uid: $uid) {\n        uid\n        name\n        description\n        active\n        deletedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ObjectivePND_usePNDUpdate(\n    $where: UpdateObjectivePNDWhereInput!\n    $data: UpdateObjectivePNDDataInput!\n  ) {\n    objectivePND {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ObjectivePND_usePNDUpdate(\n    $where: UpdateObjectivePNDWhereInput!\n    $data: UpdateObjectivePNDDataInput!\n  ) {\n    objectivePND {\n      update(where: $where, data: $data) {\n        uid\n        name\n        description\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProgram_useCreateProgram ($data: CreateProgramDataInput!) {\n    program {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProgram_useCreateProgram ($data: CreateProgramDataInput!) {\n    program {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPrograms_useGetProgram ($id: String!) {\n    program {\n      one (id: $id) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPrograms_useGetProgram ($id: String!) {\n    program {\n      one (id: $id) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProgramList_useProgramList {\n    program {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProgramList_useProgramList {\n    program {\n      list {\n        records {\n          uid\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProgram_useUpdateProgram ($data: UpdateProgramDataInput!, $where: UpdateProgramWhereInput!) {\n    program {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProgram_useUpdateProgram ($data: UpdateProgramDataInput!, $where: UpdateProgramWhereInput!) {\n    program {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProject_useCreateProject ($data: CreateProjectDataInput!) {\n    project {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject_useCreateProject ($data: CreateProjectDataInput!) {\n    project {\n      create (data: $data) {\n        uid\n        name\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProjects_useGetProject ($id: String!) {\n    project {\n      one (id: $id) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        program {\n          uid\n        }\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjects_useGetProject ($id: String!) {\n    project {\n      one (id: $id) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        program {\n          uid\n        }\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProjectList_useProjectList ($programId: String!) {\n    project {\n      list (programId: $programId) {\n        records {\n          uid\n          name\n          program {\n            uid\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProjectList_useProjectList ($programId: String!) {\n    project {\n      list (programId: $programId) {\n        records {\n          uid\n          name\n          program {\n            uid\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProject_useUpdateProject ($data: UpdateProjectDataInput!, $where: UpdateProjectWhereInput!) {\n    project {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProject_useUpdateProject ($data: UpdateProjectDataInput!, $where: UpdateProjectWhereInput!) {\n    project {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        responsible {\n          uid\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ProjectTask_useCreateProjectTask ($data: CreateProjectTaskDataInput!) {\n    projectTask {\n      create (data: $data) {\n        uid\n        name\n        description\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ProjectTask_useCreateProjectTask ($data: CreateProjectTaskDataInput!) {\n    projectTask {\n      create (data: $data) {\n        uid\n        name\n        description\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectTask_useGetProjectTask ($uid: String!) {\n    projectTask {\n      one (uid: $uid) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProjectTask_useGetProjectTask ($uid: String!) {\n    projectTask {\n      one (uid: $uid) {\n        uid\n        name\n        description\n        status\n        startDate\n        endDate\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProjectTask_useProjectTaskList ($projectUid: String!) {\n    projectTask {\n      list (projectUid: $projectUid) {\n        records {\n          uid\n          name\n          description\n          status\n          startDate\n          endDate\n          responsible {\n            uid\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProjectTask_useProjectTaskList ($projectUid: String!) {\n    projectTask {\n      list (projectUid: $projectUid) {\n        records {\n          uid\n          name\n          description\n          status\n          startDate\n          endDate\n          responsible {\n            uid\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ProjectTask_useUpdateProjectTask ($data: UpdateProjectTaskDataInput!, $where: UpdateProjectTaskWhereInput!) {\n    projectTask {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        status\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ProjectTask_useUpdateProjectTask ($data: UpdateProjectTaskDataInput!, $where: UpdateProjectTaskWhereInput!) {\n    projectTask {\n      update (data: $data, where: $where) {\n        uid\n        name\n        description\n        status\n        responsible {\n          uid\n          name\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser_useCreateUser ($data: CreateUserDataInput!) {\n    user {\n      create (data: $data) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser_useCreateUser ($data: CreateUserDataInput!) {\n    user {\n      create (data: $data) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers_useGetUser ($id: String!) {\n    user {\n      one (id: $id) {\n        uid\n        name\n        person {\n          dni\n          firstName\n          lastName\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUsers_useGetUser ($id: String!) {\n    user {\n      one (id: $id) {\n        uid\n        name\n        person {\n          dni\n          firstName\n          lastName\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser_useUpdateUser ($data: UpdateUserDataInput!, $where: UpdateUserWhereInput!) {\n    user {\n      update (data: $data, where: $where) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser_useUpdateUser ($data: UpdateUserDataInput!, $where: UpdateUserWhereInput!) {\n    user {\n      update (data: $data, where: $where) {\n        uid\n        name\n        person {\n          firstName\n          lastName\n          dni\n        }\n        active\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers_useUserList {\n    user {\n      list {\n        records {\n          uid\n          name\n          person {\n            firstName\n            lastName\n          }\n          active\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUsers_useUserList {\n    user {\n      list {\n        records {\n          uid\n          name\n          person {\n            firstName\n            lastName\n          }\n          active\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;