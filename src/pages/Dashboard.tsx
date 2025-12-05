import { Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Dashboard = () => {
  const { projects } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-light">
      {/* Header */}
      <header className="bg-surface-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-text-primary">mis proyectos</h1>
          <Button variant="outline" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar"
              className="pl-10 bg-surface-white border-border"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="block">
              <Card className="bg-muted hover:bg-muted/80 transition-colors cursor-pointer border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-text-secondary">{project.name}</h3>
                    <p className="text-text-primary font-medium">Ir al proyecto</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {/* Add New Project Card */}
          <Card
            className="bg-surface-white hover:bg-muted/20 transition-colors cursor-pointer border-2 border-dashed border-border"
            onClick={() => navigate("/projects/new")}
          >
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nuevo proyecto</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;