import { useNavigate } from '@remix-run/react'
import { type FormEvent, useMemo, useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  type AuditEventFiltersInput,
  AuditEventStatus,
  AuditResourceType,
} from '~/gql/graphql'
import { useAuditList } from '~/hooks/audit/useAuditList'
import { formatDateTime } from './utils'

const ALL_FILTER_VALUE = 'all'

const STATUS_OPTIONS = [
  { value: AuditEventStatus.Pending, label: 'Pendiente' },
  { value: AuditEventStatus.Succeeded, label: 'Exitoso' },
  { value: AuditEventStatus.Failed, label: 'Fallido' },
] as const

const RESOURCE_TYPE_OPTIONS = [
  { value: AuditResourceType.User, label: 'Usuario' },
  { value: AuditResourceType.Project, label: 'Proyecto' },
  { value: AuditResourceType.Program, label: 'Programa' },
  { value: AuditResourceType.Goal, label: 'Meta' },
  { value: AuditResourceType.Indicator, label: 'Indicador' },
  { value: AuditResourceType.Institution, label: 'Institucion' },
  { value: AuditResourceType.InstitutionalPlan, label: 'Plan institucional' },
  {
    value: AuditResourceType.InstitutionalObjective,
    label: 'Objetivo institucional',
  },
  { value: AuditResourceType.ObjectivePnd, label: 'Objetivo PND' },
  { value: AuditResourceType.ObjectiveOds, label: 'Objetivo ODS' },
  { value: AuditResourceType.ProjectObjective, label: 'Objetivo de proyecto' },
  { value: AuditResourceType.ProjectTask, label: 'Tarea de proyecto' },
  {
    value: AuditResourceType.AlignmentInstitutionalPnd,
    label: 'Alineacion institucional-PND',
  },
  {
    value: AuditResourceType.AlignmentPndOds,
    label: 'Alineacion PND-ODS',
  },
  {
    value: AuditResourceType.AlignmentProjectObjectiveOds,
    label: 'Alineacion proyecto-ODS',
  },
  { value: AuditResourceType.AuthSession, label: 'Sesion de autenticacion' },
] as const

type AuditFilterForm = {
  status: AuditEventStatus | ''
  resourceType: AuditResourceType | ''
  action: string
  actorLabel: string
  resourceUid: string
}

const EMPTY_FILTERS: AuditFilterForm = {
  status: '',
  resourceType: '',
  action: '',
  actorLabel: '',
  resourceUid: '',
}

function translateStatus(status: AuditEventStatus) {
  switch (status) {
    case AuditEventStatus.Pending:
      return 'Pendiente'
    case AuditEventStatus.Succeeded:
      return 'Exitoso'
    case AuditEventStatus.Failed:
      return 'Fallido'
  }
}

function translateResourceType(resourceType: AuditResourceType) {
  return (
    RESOURCE_TYPE_OPTIONS.find((option) => option.value === resourceType)
      ?.label ?? resourceType
  )
}

function getStatusVariant(
  status: AuditEventStatus,
): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case AuditEventStatus.Succeeded:
      return 'default'
    case AuditEventStatus.Pending:
      return 'secondary'
    case AuditEventStatus.Failed:
      return 'destructive'
  }
}

function buildFilters(
  filters: AuditFilterForm,
): AuditEventFiltersInput | undefined {
  const nextFilters: AuditEventFiltersInput = {}

  if (filters.status) {
    nextFilters.status = filters.status
  }
  if (filters.resourceType) {
    nextFilters.resourceType = filters.resourceType
  }
  if (filters.action.trim()) {
    nextFilters.action = filters.action.trim()
  }
  if (filters.actorLabel.trim()) {
    nextFilters.actorLabel = filters.actorLabel.trim()
  }
  if (filters.resourceUid.trim()) {
    nextFilters.resourceUid = filters.resourceUid.trim()
  }

  return Object.keys(nextFilters).length > 0 ? nextFilters : undefined
}

function getActorLabel(event: {
  actorLabel?: string | null
  actorUser?: {
    name: string
    person?: { firstName: string; lastName: string } | null
  } | null
}) {
  if (event.actorLabel) {
    return event.actorLabel
  }

  if (event.actorUser?.person) {
    return `${event.actorUser.person.firstName} ${event.actorUser.person.lastName}`
  }

  if (event.actorUser?.name) {
    return event.actorUser.name
  }

  return '-'
}

export function AuditPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] =
    useState<AuditFilterForm>(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<AuditFilterForm>(EMPTY_FILTERS)

  const filters = useMemo(() => buildFilters(appliedFilters), [appliedFilters])
  const { auditEvents, error, loading, total } = useAuditList({
    filters,
    limit: 50,
    offset: 0,
  })

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedFilters(draftFilters)
  }

  const handleClearFilters = () => {
    setDraftFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <Title variant='h4'>Auditoria</Title>
        <Badge variant='outline'>{total} registros</Badge>
      </div>

      <form
        className='grid grid-cols-1 gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5'
        onSubmit={handleApplyFilters}
      >
        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Estado
          </Paragraph>
          <Select
            value={draftFilters.status || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              setDraftFilters((current) => ({
                ...current,
                status:
                  value === ALL_FILTER_VALUE ? '' : (value as AuditEventStatus),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Todos' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Recurso
          </Paragraph>
          <Select
            value={draftFilters.resourceType || ALL_FILTER_VALUE}
            onValueChange={(value) =>
              setDraftFilters((current) => ({
                ...current,
                resourceType:
                  value === ALL_FILTER_VALUE
                    ? ''
                    : (value as AuditResourceType),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Todos' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
              {RESOURCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Accion
          </Paragraph>
          <Input
            placeholder='create, update, login...'
            value={draftFilters.action}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                action: event.target.value,
              }))
            }
          />
        </div>

        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Actor
          </Paragraph>
          <Input
            placeholder='Nombre o etiqueta'
            value={draftFilters.actorLabel}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                actorLabel: event.target.value,
              }))
            }
          />
        </div>

        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Resource UID
          </Paragraph>
          <Input
            placeholder='UID del recurso'
            value={draftFilters.resourceUid}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                resourceUid: event.target.value,
              }))
            }
          />
        </div>

        <div className='flex items-end gap-2 md:col-span-2 xl:col-span-5'>
          <Button type='submit'>Aplicar filtros</Button>
          <Button
            type='button'
            variant='secondary'
            onClick={handleClearFilters}
          >
            Limpiar
          </Button>
        </div>
      </form>

      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}

      {loading ? (
        <Skeleton className='h-96 w-full' />
      ) : auditEvents.length === 0 ? (
        <Paragraph>
          No hay eventos de auditoria para los filtros seleccionados
        </Paragraph>
      ) : (
        <div className='overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Accion</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Resource UID</TableHead>
                <TableHead>Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEvents.map((auditEvent) => (
                <TableRow
                  key={auditEvent.uid}
                  className='cursor-pointer'
                  onClick={() => navigate(`/audit/${auditEvent.uid}`)}
                >
                  <TableCell>{formatDateTime(auditEvent.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(auditEvent.status)}>
                      {translateStatus(auditEvent.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{auditEvent.action}</TableCell>
                  <TableCell>
                    {translateResourceType(auditEvent.resourceType)}
                  </TableCell>
                  <TableCell>{auditEvent.resourceUid ?? '-'}</TableCell>
                  <TableCell>{getActorLabel(auditEvent)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
