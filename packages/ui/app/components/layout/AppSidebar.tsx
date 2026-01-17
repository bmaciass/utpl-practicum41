import { Link, useLocation, useNavigate } from '@remix-run/react'
import { ChevronRight, LogOut } from 'lucide-react'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import { navigationConfig, type NavItem } from '~/config/navigation'

function filterNavigation(items: NavItem[], isAdmin: boolean): NavItem[] {
  return items
    .map((item) => {
      if (!item.children) return item
      const children = item.children.filter((child) => {
        if (!child.href) return true
        return isAdmin || child.href !== '/users'
      })
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
    <Sidebar>
      <SidebarHeader>
        <div className='px-4 py-4'>
          <h2 className='text-lg font-semibold'>UTPL Practicum</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
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
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname.startsWith(
                                  child.href!,
                                )}
                              >
                                <Link to={child.href!}>
                                  <child.icon className='h-4 w-4' />
                                  <span>{child.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Single navigation item
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                    >
                      <Link to={item.href!}>
                        <item.icon className='h-4 w-4' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
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
            <SidebarMenuButton onClick={handleLogout}>
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
