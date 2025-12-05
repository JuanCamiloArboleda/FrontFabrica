import React, { createContext, useContext, useState } from "react";

export type UserRole = "admin" | "docente" | "usuario" | "viewer";

export interface User {
  email: string;
  role: UserRole;
}

export interface Document {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  content: string;
  type?: string;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  documents: string[];
}

interface AppState {
  user: User | null;
  documents: Document[];
  projects: Project[];
  login: (user: User) => void;
  logout: () => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "demo-proyecto-1",
      name: "Proyecto Demo Inicial",
      owner: "admin@innosistemas.com",
      createdAt: new Date().toISOString(),
      documents: [],
    },
  ]);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  const addDocument = (doc: Document) => setDocuments((docs) => [...docs, doc]);
  const removeDocument = (id: string) => setDocuments((docs) => docs.filter((d) => d.id !== id));

  const addProject = (project: Project) => setProjects((ps) => [...ps, project]);
  const removeProject = (id: string) => setProjects((ps) => ps.filter((p) => p.id !== id));

  return (
    <AppContext.Provider value={{ user, documents, projects, login, logout, addDocument, removeDocument, addProject, removeProject }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
