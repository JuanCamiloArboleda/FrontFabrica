import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Projects: React.FC = () => {
  const { user, projects } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-brand-blue">Proyectos</h1>
        <div className="mb-8 text-center">
          {user && user.role !== "viewer" ? (
            <Button onClick={() => navigate("/projects/new")}
              className="bg-brand-blue text-white px-6 py-2 rounded shadow hover:bg-brand-blue/80">
              Crear nuevo proyecto
            </Button>
          ) : (
            <div className="text-muted-foreground text-sm">Solo puedes visualizar los proyectos.</div>
          )}
        </div>
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <div className="text-muted-foreground text-center py-12 border rounded-lg bg-muted/30">
              No hay proyectos creados.
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${project.id}`} className="font-bold text-xl text-brand-blue truncate hover:underline">
                    {project.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">Creado por: {project.owner}</div>
                  <div className="text-xs text-muted-foreground">ID: {project.id}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
