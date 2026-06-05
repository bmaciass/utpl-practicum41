import { Link, useParams } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { useState } from 'react'
import { DetailHero } from '~/components/DetailHero'
import { Alert } from '~/components/globals/Alert'
import { InstitutionalObjectiveList } from '~/components/pages/institutionalObjective/InstitutionalObjectiveList'
import { InstitutionalPlanList } from '~/components/pages/institutionalPlan/InstitutionalPlanList'
import { Paragraph } from '~/components/typography/Paragraph'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useRegisterBreadcrumbName } from '~/context/BreadcrumbNames'
import { withAuth } from '~/helpers/withAuth'
import { useGetInstitution } from '~/hooks/institution/useGetInstitution'
import { useUpdateInstitution } from '~/hooks/institution/useUpdateInstitution'
import { useInstitutionalObjectiveList } from '~/hooks/institutionalObjective/useInstitutionalObjectiveList'
import { useInstitutionalPlanList } from '~/hooks/institutionalPlan/useInstitutionalPlanList'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const PlansSection = ({ institutionUid }: { institutionUid: string }) => {
  const { institutionalPlans, loading, error } =
    useInstitutionalPlanList(institutionUid)

  if (loading) return <Skeleton className='h-32 w-full' />
  if (error)
    return (
      <Alert
        variant='error'
        description={`Error cargando planes: ${error.message}`}
      />
    )
  if (institutionalPlans.length === 0)
    return <Paragraph>No hay planes institucionales creados</Paragraph>

  return (
    <InstitutionalPlanList
      list={institutionalPlans}
      institutionUid={institutionUid}
    />
  )
}

const ObjectivesSection = ({ institutionUid }: { institutionUid: string }) => {
  const { list, loading, error } = useInstitutionalObjectiveList({
    institutionUid,
  })

  if (loading) return <Skeleton className='h-32 w-full' />
  if (error)
    return (
      <Alert
        variant='error'
        description={`Error cargando objetivos: ${error.message}`}
      />
    )

  return (
    <InstitutionalObjectiveList list={list} institutionUid={institutionUid} />
  )
}

const AREA_LABELS: Record<string, string> = {
  educacion: 'Educación',
}

const LEVEL_LABELS: Record<string, string> = {
  nacional: 'Nacional',
}

function InstitutionDetailPage() {
  const { uid } = useParams()
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'objectives'>('plans')

  if (!uid) {
    return <Alert variant='error' description='Parametro no encontrado' />
  }

  const { error, loading, institution } = useGetInstitution(uid)
  useRegisterBreadcrumbName(uid, institution?.name)

  const { updateInstitution, loading: updating } = useUpdateInstitution()

  const handleDeactivate = async () => {
    await updateInstitution({
      variables: { where: { id: uid }, data: { active: false } },
    })
    setDeactivateOpen(false)
  }

  return (
    <div className='p-4 space-y-6'>
      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}

      <DetailHero
        backTo='/institutions'
        title={capitalize(institution?.name ?? '')}
        active={institution?.active}
        loading={loading}
        fields={
          institution
            ? [
                {
                  label: 'Área',
                  value: AREA_LABELS[institution.area] ?? institution.area,
                },
                {
                  label: 'Nivel',
                  value: LEVEL_LABELS[institution.level] ?? institution.level,
                },
              ]
            : []
        }
        menuActions={[
          {
            label: 'Desactivar',
            onClick: () => setDeactivateOpen(true),
            destructive: true,
          },
        ]}
        menuDisabled={updating}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
      >
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='plans'>Planes</TabsTrigger>
            <TabsTrigger value='objectives'>Objetivos</TabsTrigger>
          </TabsList>
          <Link
            to={
              activeTab === 'plans'
                ? `/institutions/${uid}/plans/new`
                : `/institutions/${uid}/objectives/new`
            }
          >
            <Button size='sm'>Nuevo</Button>
          </Link>
        </div>
        <TabsContent value='plans'>
          <PlansSection institutionUid={uid} />
        </TabsContent>
        <TabsContent value='objectives'>
          <ObjectivesSection institutionUid={uid} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar institución</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion marcara la institución como inactiva. Puedes
              reactivarla luego editandola.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} disabled={updating}>
              {updating ? 'Desactivando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <InstitutionDetailPage />}</ClientOnly>
}
