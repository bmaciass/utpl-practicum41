import { useEffect, useMemo, useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Skeleton } from '~/components/ui/skeleton'
import { useInstitutionalAlignments } from '~/hooks/alignment/useInstitutionalAlignments'
import { useSaveInstitutionalAlignments } from '~/hooks/alignment/useSaveInstitutionalAlignments'
import { usePNDList } from '~/hooks/pnd/usePNDList'
import { cn } from '~/lib/utils'

type Props = {
  institutionalObjectiveUid: string
  objectiveName?: string
  objectiveDescription?: string | null
  onCancel: () => void
  onSaved?: () => void
}

export function InstitutionalObjectiveAlignment(props: Props) {
  const {
    institutionalObjectiveUid,
    objectiveName,
    objectiveDescription,
    onCancel,
    onSaved,
  } = props

  const {
    called: pndCalled,
    data: pndObjectives,
    loading: pndLoading,
    error: pndError,
  } = usePNDList()

  const availablePndObjectives = useMemo(
    () => pndObjectives.filter((objective) => objective.active),
    [pndObjectives],
  )

  const {
    alignments,
    loading: alignmentsLoading,
    error: alignmentsError,
    refetch: refetchAlignments,
  } = useInstitutionalAlignments(institutionalObjectiveUid, {
    skip: pndLoading || !pndCalled,
  })

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [initial, setInitial] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (alignmentsLoading) return
    const alignedUids = new Set(
      alignments.map((alignment) => alignment.pndObjectiveUid),
    )
    setSelected(alignedUids)
    setInitial(alignedUids)
  }, [alignments, alignmentsLoading])

  const toggleSelection = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(uid)) {
        next.delete(uid)
      } else {
        next.add(uid)
      }
      return next
    })
  }

  const hasChanges = useMemo(() => {
    if (selected.size !== initial.size) return true
    for (const uid of selected) {
      if (!initial.has(uid)) return true
    }
    return false
  }, [initial, selected])

  const {
    saveAlignments,
    loading: saving,
    error: saveError,
  } = useSaveInstitutionalAlignments()

  const handleCancel = () => {
    setSelected(new Set(initial))
    onCancel()
  }

  const handleSave = async () => {
    try {
      await saveAlignments({
        institutionalObjectiveUid,
        nextSelected: Array.from(selected),
        currentSelected: Array.from(initial),
      })
      await refetchAlignments?.()
      setInitial(new Set(selected))
      if (onSaved) onSaved()
    } catch (_err) {
      // handled via saveError
    }
  }

  if (pndLoading || alignmentsLoading) {
    return <Skeleton className='h-96 w-full' />
  }

  if (pndError) {
    return (
      <Alert
        variant='error'
        description={`Error cargando PND: ${pndError.message}`}
      />
    )
  }

  if (alignmentsError) {
    return (
      <Alert
        variant='error'
        description={`Error cargando alineaciones: ${alignmentsError.message}`}
      />
    )
  }

  if (!availablePndObjectives.length) {
    return (
      <Alert
        variant='info'
        description='No hay objetivos PND disponibles. Crea objetivos PND antes de alinear.'
      />
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Title variant='h4'>Alinear con Objetivos PND</Title>
          <Paragraph className='text-sm text-muted-foreground text-left'>
            Selecciona los objetivos PND que alinean con este objetivo
            institucional.
          </Paragraph>
        </div>
        <div className='flex gap-2'>
          <Button variant='secondary' onClick={handleCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            Guardar
          </Button>
        </div>
      </div>

      {saveError && (
        <Alert
          variant='error'
          description={saveError.cause?.message ?? saveError.message}
        />
      )}

      <div className='grid grid-cols-5 gap-4'>
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>{objectiveName}</CardTitle>
            <CardDescription>Objetivo institucional</CardDescription>
          </CardHeader>
          <CardContent>
            {objectiveDescription ? (
              <Paragraph className='text-sm leading-6 text-left'>
                {objectiveDescription}
              </Paragraph>
            ) : (
              <Paragraph className='text-muted-foreground'>
                Sin descripción
              </Paragraph>
            )}
            <Paragraph className='text-xs text-muted-foreground mt-2'>
              Las alineaciones actuales se muestran resaltadas a la derecha.
            </Paragraph>
          </CardContent>
        </Card>

        <div className='col-span-3'>
          <div className='grid gap-3'>
            {availablePndObjectives.map((objective) => {
              const isSelected = selected.has(objective.uid)
              return (
                <Card
                  key={objective.uid}
                  className={cn(
                    'cursor-pointer border-2 transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/20 hover:border-primary/50',
                  )}
                  onClick={() => toggleSelection(objective.uid)}
                >
                  <CardHeader className='pb-2'>
                    <div className='flex items-start gap-3'>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelection(objective.uid)}
                        onClick={(event) => event.stopPropagation()}
                      />
                      <div className='space-y-1'>
                        <CardTitle className='text-base'>
                          {objective.name}
                        </CardTitle>
                        <CardDescription className='text-sm'>
                          {objective.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
