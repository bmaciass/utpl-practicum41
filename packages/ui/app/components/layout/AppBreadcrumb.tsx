import { Link, useLocation } from '@remix-run/react'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useBreadcrumbNames } from '~/context/BreadcrumbNames'

type BreadcrumbItem = {
  href: string
  label: string
}

const STATIC_SEGMENT_LABELS: Record<string, string> = {
  audit: 'Auditoria',
  edit: 'Editar',
  goal: 'Meta',
  goals: 'Metas',
  home: 'Inicio',
  indicator: 'Indicador',
  institutions: 'Instituciones',
  new: 'Nuevo',
  objectives: 'Objetivos',
  ods: 'Objetivos ODS',
  plans: 'Planes',
  pnd: 'Objetivos PND',
  programs: 'Programas',
  projects: 'Proyectos',
  reports: 'Reportes',
  users: 'Usuarios',
}

function normalizePathname(pathname: string) {
  if (pathname === '/') {
    return pathname
  }

  return pathname.replace(/\/+$/, '')
}

function buildPathFromSegments(segments: string[]) {
  return `/${segments.join('/')}`
}

function getSelectedGoalPath(segments: string[]) {
  const goalIndex = segments.findIndex((segment) => segment === 'goal')
  if (goalIndex !== -1 && segments[goalIndex + 1]) {
    return buildPathFromSegments(segments.slice(0, goalIndex + 2))
  }

  const goalsIndex = segments.findIndex((segment) => segment === 'goals')
  if (goalsIndex !== -1 && segments[goalsIndex + 1]) {
    return buildPathFromSegments([
      ...segments.slice(0, goalsIndex),
      'goal',
      segments[goalsIndex + 1],
    ])
  }

  return undefined
}

function resolveBreadcrumbHref(
  segments: string[],
  index: number,
  currentPath: string,
) {
  const segment = segments[index]

  if (segment === 'goals' || segment === 'goal') {
    return buildPathFromSegments(segments.slice(0, index))
  }

  if (segment === 'indicator') {
    return (
      getSelectedGoalPath(segments) ??
      buildPathFromSegments(segments.slice(0, index))
    )
  }

  return currentPath
}

export function AppBreadcrumb() {
  const location = useLocation()
  const { getLabel } = useBreadcrumbNames()

  const breadcrumbs = useMemo(() => {
    const normalizedPathname = normalizePathname(location.pathname)
    const segments = normalizedPathname.split('/').filter(Boolean)

    if (
      segments.length === 0 ||
      (segments.length === 1 && segments[0] === 'home')
    ) {
      return [{ href: '/home', label: 'Inicio' }]
    }

    const items: BreadcrumbItem[] = [{ href: '/home', label: 'Inicio' }]
    let currentPath = ''

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const breadcrumbHref = resolveBreadcrumbHref(segments, index, currentPath)

      if (segment === 'home') {
        return
      }

      const staticLabel = STATIC_SEGMENT_LABELS[segment]
      if (staticLabel) {
        items.push({ href: breadcrumbHref, label: staticLabel })
        return
      }

      const registeredLabel = getLabel(segment)
      if (registeredLabel) {
        items.push({ href: breadcrumbHref, label: registeredLabel })
        return
      }

      items.push({ href: breadcrumbHref, label: 'Cargando...' })
    })

    return items
  }, [getLabel, location.pathname])

  return (
    <nav aria-label='Breadcrumb' className='min-w-0 flex-1'>
      <ol className='flex min-w-0 items-center gap-1 overflow-hidden text-sm text-muted-foreground'>
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrentPage = index === breadcrumbs.length - 1

          return (
            <li
              className='flex min-w-0 items-center gap-1'
              key={breadcrumb.href}
            >
              {isCurrentPage ? (
                <span
                  aria-current='page'
                  className='truncate font-medium text-foreground'
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  className='truncate rounded-sm px-1 py-0.5 transition-colors hover:text-foreground'
                  to={breadcrumb.href}
                >
                  {breadcrumb.label}
                </Link>
              )}
              {!isCurrentPage ? (
                <ChevronRight className='h-3.5 w-3.5 shrink-0' />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
