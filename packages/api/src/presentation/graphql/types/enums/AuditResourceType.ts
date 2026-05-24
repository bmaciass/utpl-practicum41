import builder from '../../schema/builder'

export const AuditResourceTypeEnum = builder.enumType('AuditResourceType', {
  values: [
    'user',
    'project',
    'program',
    'goal',
    'indicator',
    'institution',
    'institutional_plan',
    'institutional_objective',
    'objective_pnd',
    'objective_ods',
    'project_objective',
    'project_task',
    'alignment_institutional_pnd',
    'alignment_pnd_ods',
    'alignment_project_objective_ods',
    'auth_session',
  ] as const,
})
