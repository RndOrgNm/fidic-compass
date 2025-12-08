import { Home, BarChart3, Receipt, Users, Bot, LogOut, TrendingUp } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Gestão de Recebimentos", url: "/receivables", icon: Receipt },
  { title: "CRM", url: "/investors", icon: Users },
  { title: "Chatbot", url: "/agent", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getNavCls = (isActive: boolean) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">FIDC Manager</h1>
              <p className="text-xs text-sidebar-foreground/70">Gestão de Fundos</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                // Special handling for Chatbot to reset Agent page
                const handleChatbotClick = (e: React.MouseEvent) => {
                  if (item.title === "Chatbot" && location.pathname === "/agent") {
                    e.preventDefault();
                    // Navigate with state to trigger reset
                    navigate("/agent", { 
                      replace: true,
                      state: { reset: true }
                    });
                  }
                };
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls(isActive)}
                        onClick={handleChatbotClick}
                      >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">Maria Silva</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">Gestora</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="mt-2 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
