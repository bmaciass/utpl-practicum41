import {
  Home,
  Users,
  Building,
  FolderOpen,
  BarChart,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href?: string
  icon: LucideIcon
  children?: NavItem[]
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Inicio',
    href: '/home',
    icon: Home,
  },
  {
    title: 'Gestión',
    icon: Settings,
    children: [
      {
        title: 'Usuarios',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Instituciones',
        href: '/institutions',
        icon: Building,
      },
      {
        title: 'Programas',
        href: '/programs',
        icon: FolderOpen,
      },
    ],
  },
  {
    title: 'Objetivos',
    icon: Target,
    children: [
      {
        title: 'Objetivos PND',
        href: '/pnd',
        icon: Target,
      },
      {
        title: 'Objetivos ODS',
        href: '/ods',
        icon: Target,
      },
    ],
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart,
  },
]
