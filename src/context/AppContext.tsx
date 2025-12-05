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
  // Leer datos de localStorage al iniciar
  const getInitialUser = (): User | null => {
    const data = localStorage.getItem("ff_user");
    return data ? JSON.parse(data) : null;
  };
  const FINAL_DOC = {
    id: "doc-final-2025",
    name: "Examen Final 2025-2.pdf",
    owner: "admin@innosistemas.com",
    createdAt: new Date().toISOString(),
    // Reemplaza el siguiente string por el resultado base64 generado por tu script
    content: "data:application/pdf;base64,PASTE_YOUR_BASE64_STRING_HERE",
    type: "application/pdf",
  };
  const getInitialDocuments = (): Document[] => {
    const data = localStorage.getItem("ff_documents");
    let docs = data ? JSON.parse(data) : [];
    if (!docs.find((d: Document) => d.id === FINAL_DOC.id)) {
      docs = [FINAL_DOC, ...docs];
    }
    return docs;
  };
  const getInitialProjects = (): Project[] => {
    const data = localStorage.getItem("ff_projects");
    let projs = data ? JSON.parse(data) : [
      {
        id: "demo-proyecto-1",
        name: "Proyecto Demo Inicial",
        owner: "admin@innosistemas.com",
        createdAt: new Date().toISOString(),
        documents: [],
      },
    ];
    // Asegurar que el documento final esté vinculado
    const demo = projs.find((p: Project) => p.id === "demo-proyecto-1");
    if (demo && !demo.documents.includes(FINAL_DOC.id)) {
      demo.documents.unshift(FINAL_DOC.id);
    }
    return projs;
  };

  const [user, setUser] = useState<User | null>(getInitialUser());
  const [documents, setDocuments] = useState<Document[]>(getInitialDocuments());
  const [projects, setProjects] = useState<Project[]>(getInitialProjects());

  // Guardar en localStorage cada vez que cambian
  React.useEffect(() => {
    localStorage.setItem("ff_user", JSON.stringify(user));
  }, [user]);
  React.useEffect(() => {
    localStorage.setItem("ff_documents", JSON.stringify(documents));
  }, [documents]);
  React.useEffect(() => {
    localStorage.setItem("ff_projects", JSON.stringify(projects));
  }, [projects]);

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
