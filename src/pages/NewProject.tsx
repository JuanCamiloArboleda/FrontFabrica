import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NewProject: React.FC = () => {
  const { user, addProject } = useAppContext();
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<string>("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    setError("");
    if (!user || user.role === "viewer") {
      setError("No tienes permisos para crear proyectos.");
      return;
    }
    const emails = participants.split(",").map((e) => e.trim()).filter(Boolean);
    const hasDocente = emails.some((e) => e === "docente@innosistemas.com");
    const hasUsuario = emails.some((e) => e === "usuario@innosistemas.com" || e === "usuario2@innosistemas.com");
    if (!name || emails.length === 0 || !hasDocente || !hasUsuario) {
      setError("Debes ingresar nombre, al menos un docente y un usuario.");
      return;
    }
    const newProject = {
      id: Math.random().toString(36).slice(2),
      name,
      owner: user?.email || "",
      createdAt: new Date().toISOString(),
      documents: [],
    };
    addProject(newProject);
    navigate("/projects");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo proyecto</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nombre del proyecto</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Participantes (emails separados por coma)</label>
        <input
          type="text"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <div className="text-xs text-muted-foreground mt-1">Ejemplo: docente@innosistemas.com, usuario@innosistemas.com</div>
      </div>
      <Button onClick={handleCreate}>Crear proyecto</Button>
    </div>
  );
};

export default NewProject;
