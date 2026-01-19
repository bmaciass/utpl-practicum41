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
import { useProjectObjectiveAlignments } from '~/hooks/alignment/useProjectObjectiveAlignments'
import { useSaveProjectObjectiveAlignments } from '~/hooks/alignment/useSaveProjectObjectiveAlignments'
import { useODSList } from '~/hooks/ods/useODSList'
import { cn } from '~/lib/utils'

type Props = {
  projectObjectiveUid: string
  objectiveName?: string
  onCancel: () => void
  onSaved?: () => void
}

export function ProjectObjectiveAlignment(props: Props) {
  const { projectObjectiveUid, objectiveName, onCancel, onSaved } = props

  const {
    called: odsCalled,
    loading: odsLoading,
    odsList,
    error: odsError,
  } = useODSList()

  const availableOds = useMemo(
    () => odsList.filter((objective) => objective.active),
    [odsList],
  )

  const {
    alignments,
    loading: alignmentsLoading,
    error: alignmentsError,
    refetch,
  } = useProjectObjectiveAlignments(projectObjectiveUid, {
    skip: odsLoading || !odsCalled,
  })

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [initial, setInitial] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (alignmentsLoading) return
    const aligned = new Set(
      alignments.map((alignment) => alignment.odsObjectiveUid),
    )
    setSelected(aligned)
    setInitial(aligned)
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
  } = useSaveProjectObjectiveAlignments()

  const handleCancel = () => {
    setSelected(new Set(initial))
    onCancel()
  }

  const handleSave = async () => {
    try {
      await saveAlignments({
        projectObjectiveUid,
        nextSelected: Array.from(selected),
        currentSelected: Array.from(initial),
      })
      await refetch?.()
      setInitial(new Set(selected))
      if (onSaved) onSaved()
    } catch (_err) {
      // handled via error UI
    }
  }

  if (odsLoading || alignmentsLoading) {
    return <Skeleton className='h-96 w-full' />
  }

  if (odsError) {
    return (
      <Alert
        variant='error'
        description={`Error cargando ODS: ${odsError.message}`}
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

  if (!availableOds.length) {
    return (
      <Alert
        variant='info'
        description='No hay objetivos ODS disponibles. Crea objetivos ODS antes de alinear.'
      />
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Title variant='h4'>Alinear con Objetivos ODS</Title>
          <Paragraph className='text-sm text-muted-foreground text-left'>
            Selecciona los objetivos ODS que se alinean con este objetivo.
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
            <CardDescription>Objetivo del proyecto</CardDescription>
          </CardHeader>
          <CardContent>
            <Paragraph className='text-xs text-muted-foreground mt-2'>
              Las alineaciones actuales se muestran resaltadas a la derecha.
            </Paragraph>
          </CardContent>
        </Card>

        <div className='col-span-3'>
          <div className='grid gap-3'>
            {availableOds.map((objective) => {
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
