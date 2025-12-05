import { useState } from "react";
import { 
  Folder, 
  Activity, 
  FileText, 
  LogOut,
  Search,
  User,
  Plus,
  Shield,
  Bell,
  Download,
  GraduationCap
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import innosistemaSIcon from "@/assets/innosistemas-icon.png";
import LogoutConfirmation from "@/components/LogoutConfirmation";

const menuItems = [
  { title: "proyectos", url: "/projects", icon: Folder },
  { title: "actividad", url: "/dashboard/activity", icon: Activity },
  { title: "configuración", url: "/notification-settings", icon: Bell },
  { title: "panel docente", url: "/teacher/dashboard", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <img 
            src={innosistemaSIcon} 
            alt="InnoSistemas Icon" 
            className="w-8 h-8 object-contain"
          />
          {!collapsed && (
            <h1 className="text-lg font-semibold text-foreground">
              InnoSistemas
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard"}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span className="ml-3">cerrar sesión</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          navigate("/");
        }}
      />
    </Sidebar>
  );
}