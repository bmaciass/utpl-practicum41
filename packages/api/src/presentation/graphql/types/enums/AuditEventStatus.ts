import builder from '../../schema/builder'

export const AuditEventStatusEnum = builder.enumType('AuditEventStatus', {
  values: ['pending', 'succeeded', 'failed'] as const,
})
