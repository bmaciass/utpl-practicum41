import { Link, useLocation, useNavigate } from '@remix-run/react'
import { ChevronRight, LogOut } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '~/components/ui/sidebar'
import { type NavItem, navigationConfig } from '~/config/navigation'

function filterNavigation(items: NavItem[], isAdmin: boolean): NavItem[] {
  return items
    .filter((item) => !item.adminOnly || isAdmin)
    .map((item) => {
      if (!item.children) return item
      const children = item.children.filter(
        (child) => !child.adminOnly || isAdmin,
      )
      return { ...item, children }
    })
    .filter((item) => item.href || (item.children && item.children.length > 0))
}

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const location = useLocation()
  const navigate = useNavigate()
  const filteredNavigation = filterNavigation(navigationConfig, isAdmin)

  const handleLogout = () => {
    navigate('/logout')
  }

  return (
    <Sidebar className='border-none shadow-2xl shadow-sidebar-primary/10'>
      <SidebarHeader className='border-b border-sidebar-border/80 px-4 py-5'>
        <div className='rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar-accent to-sidebar p-4 shadow-inner shadow-black/10'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary font-semibold tracking-[0.18em] text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20'>
              UT
            </div>
            <div className='min-w-0'>
              <h2 className='truncate text-lg font-semibold tracking-tight text-sidebar-foreground'>
                UTPL Practicum
              </h2>
              <p className='text-xs text-sidebar-foreground/65'>
                Control institucional
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='px-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55'>
            Navegacion
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.children ? (
                    // Collapsible group with children
                    <Collapsible defaultOpen className='group/collapsible'>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className='h-4 w-4' />
                          <span>{item.title}</span>
                          <ChevronRight className='ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              {!child.href ? null : (
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location.pathname.startsWith(
                                    child.href,
                                  )}
                                >
                                  <Link to={child.href}>
                                    <child.icon className='h-4 w-4' />
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Single navigation item
                    item.href && (
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                      >
                        <Link to={item.href}>
                          <item.icon className='h-4 w-4' />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='border border-sidebar-border/80 bg-sidebar-accent/70 text-sidebar-foreground hover:bg-sidebar-accent'
              onClick={handleLogout}
            >
              <LogOut className='h-4 w-4' />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
