import { useNavigate, useParams } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { AuditEventStatus } from '~/gql/graphql'
import { useGetAudit } from '~/hooks/audit/useGetAudit'
import {
  formatDateTime,
  formatJsonValue,
  translateAuditResourceType,
} from './utils'

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

function DetailRow(props: { label: string; value: string }) {
  return (
    <div className='grid gap-1'>
      <Paragraph className='text-left text-sm font-medium leading-none text-muted-foreground'>
        {props.label}
      </Paragraph>
      <Paragraph className='text-left leading-6'>{props.value}</Paragraph>
    </div>
  )
}

function JsonSection(props: { title: string; value: unknown }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {props.value !== null && props.value !== undefined ? (
          <pre className='overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-50'>
            {formatJsonValue(props.value)}
          </pre>
        ) : (
          <Paragraph className='text-left'>No disponible</Paragraph>
        )}
      </CardContent>
    </Card>
  )
}

export function AuditDetailPage() {
  const navigate = useNavigate()
  const { uid } = useParams()

  if (!uid) {
    return <Alert variant='error' description='Parametro no encontrado' />
  }

  const { auditEvent, error, loading } = useGetAudit(uid)

  if (loading) {
    return <Skeleton className='h-[40rem] w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={error.cause?.message ?? error.message}
      />
    )
  }

  if (!auditEvent) {
    return (
      <Alert variant='error' description='Evento de auditoria no encontrado' />
    )
  }

  const actorName = auditEvent.actorUser?.person
    ? `${auditEvent.actorUser.person.firstName} ${auditEvent.actorUser.person.lastName}`
    : (auditEvent.actorUser?.name ?? '-')
  const actorDni = auditEvent.actorUser?.person?.dni ?? '-'

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => navigate('/audit')}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='flex-1 space-y-2'>
          <Title variant='h4'>Detalle de auditoria</Title>
          <div className='flex items-center gap-2'>
            <Badge variant={getStatusVariant(auditEvent.status)}>
              {translateStatus(auditEvent.status)}
            </Badge>
            <Paragraph className='text-left'>{auditEvent.action}</Paragraph>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <DetailRow label='UID' value={auditEvent.uid} />
          <DetailRow
            label='Fecha'
            value={formatDateTime(auditEvent.createdAt)}
          />
          <DetailRow
            label='Estado'
            value={translateStatus(auditEvent.status)}
          />
          <DetailRow label='Accion' value={auditEvent.action} />
          <DetailRow
            label='Recurso'
            value={translateAuditResourceType(auditEvent.resourceType)}
          />
          <DetailRow
            label='Resource UID'
            value={auditEvent.resourceUid ?? '-'}
          />
          <DetailRow label='Actor' value={auditEvent.actorLabel ?? actorName} />
          <DetailRow label='Usuario' value={actorName} />
          <DetailRow label='DNI' value={actorDni} />
        </CardContent>
      </Card>

      <div className='grid gap-4'>
        <JsonSection
          title='Request payload'
          value={auditEvent.requestPayload}
        />
        <JsonSection
          title='Before snapshot'
          value={auditEvent.beforeSnapshot}
        />
        <JsonSection title='After snapshot' value={auditEvent.afterSnapshot} />
        <JsonSection title='Error' value={auditEvent.error} />
        <JsonSection title='Metadata' value={auditEvent.metadata} />
      </div>
    </div>
  )
}
