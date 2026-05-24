import { AuditResourceType } from '~/gql/graphql'

export function formatDateTime(
  value: Date | string | null | undefined,
): string {
  if (!value) {
    return '-'
  }

  const date = typeof value === 'string' ? new Date(value) : value

  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatJsonValue(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export function translateAuditResourceType(resourceType: AuditResourceType) {
  switch (resourceType) {
    case AuditResourceType.User:
      return 'Usuario'
    case AuditResourceType.Project:
      return 'Proyecto'
    case AuditResourceType.Program:
      return 'Programa'
    case AuditResourceType.Goal:
      return 'Meta'
    case AuditResourceType.Indicator:
      return 'Indicador'
    case AuditResourceType.Institution:
      return 'Institucion'
    case AuditResourceType.InstitutionalPlan:
      return 'Plan institucional'
    case AuditResourceType.InstitutionalObjective:
      return 'Objetivo institucional'
    case AuditResourceType.ObjectivePnd:
      return 'Objetivo PND'
    case AuditResourceType.ObjectiveOds:
      return 'Objetivo ODS'
    case AuditResourceType.ProjectObjective:
      return 'Objetivo de proyecto'
    case AuditResourceType.ProjectTask:
      return 'Tarea de proyecto'
    case AuditResourceType.AlignmentInstitutionalPnd:
      return 'Alineacion institucional-PND'
    case AuditResourceType.AlignmentPndOds:
      return 'Alineacion PND-ODS'
    case AuditResourceType.AlignmentProjectObjectiveOds:
      return 'Alineacion proyecto-ODS'
    case AuditResourceType.AuthSession:
      return 'Sesion de autenticacion'
  }
}
