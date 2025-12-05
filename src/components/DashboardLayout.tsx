import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationsPanel } from "@/components/NotificationsPanel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Global header with trigger and notifications - always visible */}
          <div className="bg-surface-white border-b p-2 flex items-center justify-between">
            <SidebarTrigger />
            <NotificationsPanel />
          </div>
          
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;