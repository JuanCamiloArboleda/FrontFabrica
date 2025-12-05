import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Button } from "@/components/ui/button";

const ProjectDetail: React.FC = () => {
    const { id } = useParams();
    const { user, projects, documents, addDocument, removeDocument } = useAppContext();
    const navigate = useNavigate();
    const project = projects.find((p) => p.id === id);
    const [docName, setDocName] = useState("");
    const [docContent, setDocContent] = useState("");
    const [docFile, setDocFile] = useState<File | null>(null);
    const [note, setNote] = useState("");
    const [documentToView, setDocumentToView] = useState<string | null>(null);

    // Definir roles
    const isAdmin = user?.role === "admin";
    const isTeacher = user?.role === "docente";
    const isUsuario = user?.role === "usuario" || user?.role === "usuario2";
    const isViewer = user?.role === "usuario3" || user?.role === "viewer";

    if (!project) {
        return (
            <div className="p-8 min-h-screen flex items-center justify-center">
                <div className="bg-card border rounded-lg p-8 shadow text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Proyecto no encontrado</h2>
                    <div className="text-muted-foreground">Verifica el enlace o selecciona un proyecto válido.</div>
                </div>
            </div>
        );
    }

    // Filtrar documentos por proyecto usando los IDs en project.documents
    const projectDocs = documents.filter((doc) => project.documents.includes(doc.id));

    const handleAddDocument = () => {
        if (!docName || !docFile) {
            alert("Por favor, ingresa un nombre y selecciona un archivo.");
            return;
        }
        // Validar tipo de archivo
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const extAllowed = ["pdf", "doc", "docx"];
        const fileType = docFile.type;
        const fileName = docFile.name.toLowerCase();
        if (!allowedTypes.includes(fileType) && !extAllowed.some(ext => fileName.endsWith(ext))) {
            alert("Solo se permiten archivos PDF o Word");
            return;
        }
        // Crear documento con campos esperados
        const newDoc = {
            id: Math.random().toString(36).slice(2),
            name: docName,
            owner: user?.email || "",
            createdAt: new Date().toISOString(),
            content: docContent,
            type: fileType || (fileName.endsWith("pdf") ? "pdf" : fileName.endsWith("doc") || fileName.endsWith("docx") ? "word" : ""),
        };
        addDocument(newDoc);
        // Asociar el documento al proyecto
        project.documents.push(newDoc.id);
        setDocName("");
        setDocContent("");
        setDocFile(null);
    };

    const handleRemoveDocument = (docId: string) => {
        removeDocument(docId);
    };

    const handleViewDocument = (doc: typeof projectDocs[0]) => {
        if (doc.content) {
            setDocumentToView(doc.content);
        } else {
            alert("Este documento no tiene contenido para visualizar.");
        }
    };

    const handleSetNote = () => {
        // Lógica para asignar nota
        alert(`Nota asignada: ${note}`);
    };

    return (
        <div className="p-8 min-h-screen bg-background">
            <div className="max-w-3xl mx-auto bg-card border rounded-lg shadow p-8">
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-brand-blue">{project.name}</h1>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>Regresar a inicio</Button>
                </div>
                <div className="mb-4 text-xs text-muted-foreground">ID: {project.id}</div>

                {/* Formulario para subir nuevo documento */}
                {(isAdmin || isTeacher || isUsuario) && (
                    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                        <h3 className="font-semibold mb-2">Subir o modificar documento</h3>
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Nombre del documento"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                className="border rounded px-2 py-1 flex-1"
                                maxLength={50}
                            />
                            <input
                                type="text"
                                placeholder="Contenido (opcional si subes archivo)"
                                value={docContent}
                                onChange={(e) => setDocContent(e.target.value)}
                                className="border rounded px-2 py-1 flex-1"
                                maxLength={200}
                            />
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="border rounded px-2 py-1 flex-1"
                                onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                            />
                            <Button onClick={handleAddDocument} className="bg-brand-blue text-white">Subir documento</Button>
                        </div>
                    </div>
                )}

                {/* Visualización de documentos */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2 text-lg">Documentos</h2>
                    {projectDocs.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center border rounded bg-muted/30 flex flex-col items-center gap-4">
                            <span>No hay documentos en este proyecto.</span>
                        </div>
                    ) : (
                        <ul className="mb-4 divide-y">
                            {projectDocs.map((doc) => (
                                <li key={doc.id} className="flex justify-between items-center py-3">
                                    <div>
                                        <span
                                            className="font-medium text-foreground cursor-pointer"
                                            onClick={() => handleViewDocument(doc)}
                                        >
                                            {doc.name}
                                        </span>
                                        {doc.type && (
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                [{doc.type.includes("pdf") ? "PDF" : doc.type.includes("word") ? "Word" : "Texto"}]
                                            </span>
                                        )}
                                    </div>
                                    {!isViewer && (
                                        <Button variant="destructive" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                                            Eliminar
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Visualizar documento */}
                {documentToView && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="bg-white p-4 rounded-lg relative">
                            <Button onClick={() => setDocumentToView(null)} className="absolute top-2 right-2">Cerrar</Button>
                            <h3 className="text-xl font-semibold mb-2">Visualizar documento</h3>
                            <embed
                                src={documentToView}
                                type="application/pdf"
                                width="600"
                                height="800"
                                className="border"
                            />
                        </div>
                    </div>
                )}

                {isTeacher && (
                    <div className="mb-8">
                        <h2 className="font-semibold mb-2 text-lg">Asignar nota</h2>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Nota"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="border rounded px-2 py-1 w-32"
                                maxLength={5}
                            />
                            <Button onClick={handleSetNote} className="bg-green-600 text-white">Asignar</Button>
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <div className="mb-8">
                        <h2 className="font-semibold mb-2 text-lg">Administrar participantes</h2>
                        <Button variant="outline" className="bg-yellow-100 text-yellow-800">Mover participantes (mock)</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
