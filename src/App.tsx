import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import DocumentsHub from "./pages/DocumentsHub";
import AdminUserManagement from "./pages/AdminUserManagement";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotificationSettings from "./pages/NotificationSettings";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NewProject from "./pages/NewProject";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard routes with layout */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/dashboard/activity" element={
            <DashboardLayout>
              <Activity />
            </DashboardLayout>
          } />
          
          {/* Documents Hub - HU-006, HU-007, HU-008, HU-010, HU-012 */}
          <Route path="/documents" element={
            <DashboardLayout>
              <DocumentsHub />
            </DashboardLayout>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/users" element={
            <DashboardLayout>
              <AdminUserManagement />
            </DashboardLayout>
          } />
          
          {/* Settings */}
          <Route path="/notification-settings" element={
            <DashboardLayout>
              <NotificationSettings />
            </DashboardLayout>
          } />
          
          {/* Teacher routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          
          {/* Projects routes */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
