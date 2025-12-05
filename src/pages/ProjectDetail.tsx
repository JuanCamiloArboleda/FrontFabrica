import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { useToast } from "../components/ui/use-toast";

const ProjectDetail: React.FC = () => {
    const { id } = useParams();
    const { user, projects, documents, addDocument, removeDocument } = useAppContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    const project = projects.find((p) => p.id === id);

    const [docName, setDocName] = useState("");
    const [docContent, setDocContent] = useState("");
    const [docFile, setDocFile] = useState<File | null>(null);
    const [note, setNote] = useState("");
    const [documentToView, setDocumentToView] = useState<string | null>(null);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const [showFileInput, setShowFileInput] = useState(false);
    const [editingDocId, setEditingDocId] = useState<string | null>(null);

    const isAdmin = user?.role === "admin";
    const isTeacher = user?.role === "docente";
    const isUsuario = user?.role === "usuario" || user?.role === "usuario2";
    const isViewer = user?.role === "usuario3";

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

    const projectDocs = documents.filter((doc) => project.documents.includes(doc.id));

    const handleAddOrUpdateDocument = () => {
        if (!docName) {
            toast({
                title: "Nombre requerido",
                description: "Por favor, ingresa un nombre para el documento.",
                variant: "destructive",
            });
            return;
        }

        if (docFile) {
            const allowedTypes = ["application/pdf"];
            const extAllowed = ["pdf"];
            const fileType = docFile.type.toLowerCase();
            const fileName = docFile.name.toLowerCase();

            if (!allowedTypes.includes(fileType) && !extAllowed.some(ext => fileName.endsWith(ext))) {
                toast({
                    title: "Tipo de archivo no soportado",
                    description: "Solo se permite PDF.",
                    variant: "destructive",
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const fileUrl = e.target?.result as string;

                if (editingDocId) {
                    const index = documents.findIndex(d => d.id === editingDocId);
                    if (index !== -1) {
                        documents[index] = {
                            ...documents[index],
                            name: docName,
                            content: fileUrl,
                            type: "application/pdf",
                        };
                        toast({
                            title: "Documento actualizado",
                            description: `El documento '${docName}' fue actualizado.`,
                            variant: "default",
                        });
                    }
                } else {
                    const newDoc = {
                        id: Math.random().toString(36).slice(2),
                        name: docName,
                        owner: user?.email || "",
                        createdAt: new Date().toISOString(),
                        content: fileUrl,
                        type: "application/pdf",
                    };

                    addDocument(newDoc);
                    project.documents.push(newDoc.id);

                    toast({
                        title: "Documento subido",
                        description: `El documento '${docName}' fue subido.`,
                        variant: "default",
                    });
                }

                setDocName("");
                setDocContent("");
                setDocFile(null);
                setShowFileInput(false);
                setEditingDocId(null);
            };

            reader.readAsDataURL(docFile);
        } else {
            if (editingDocId) {
                const index = documents.findIndex(d => d.id === editingDocId);
                if (index !== -1) {
                    documents[index] = {
                        ...documents[index],
                        name: docName,
                        content: docContent,
                    };

                    toast({
                        title: "Documento actualizado",
                        description: `El documento '${docName}' fue actualizado.`,
                        variant: "default",
                    });
                }
            } else {
                const newDoc = {
                    id: Math.random().toString(36).slice(2),
                    name: docName,
                    owner: user?.email || "",
                    createdAt: new Date().toISOString(),
                    content: docContent,
                    type: "text/plain",
                };

                addDocument(newDoc);
                project.documents.push(newDoc.id);

                toast({
                    title: "Documento subido",
                    description: `El documento '${docName}' fue subido.`,
                    variant: "default",
                });
            }

            setDocName("");
            setDocContent("");
            setDocFile(null);
            setShowFileInput(false);
            setEditingDocId(null);
        }
    };

    const handleRemoveDocument = (docId: string) => {
        setDocToDelete(docId);
    };

    const confirmRemoveDocument = () => {
        if (docToDelete) {
            removeDocument(docToDelete);
            toast({
                title: "Documento eliminado",
                description: "El documento fue eliminado.",
                variant: "default",
            });
            setDocToDelete(null);
        }
    };

    const handleSetNote = () => {
        toast({
            title: "Nota asignada",
            description: `Nota asignada: ${note}`,
            variant: "default",
        });
    };

    return (
        <div className="p-8 min-h-screen bg-background">
            <div className="max-w-3xl mx-auto bg-card border rounded-lg shadow p-8">

                {/* Encabezado */}
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-brand-blue">{project.name}</h1>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        Regresar a inicio
                    </Button>
                </div>

                <div className="mb-4 text-xs text-muted-foreground">ID: {project.id}</div>

                {/* Subir documento */}
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
                            />

                            <input
                                type="text"
                                placeholder="Contenido (opcional)"
                                value={docContent}
                                onChange={(e) => setDocContent(e.target.value)}
                                className="border rounded px-2 py-1 flex-1"
                            />
                        </div>

                        <div className="flex justify-end mt-4 gap-2">
                            <Button variant="outline" onClick={() => setShowFileInput(!showFileInput)}>
                                {showFileInput ? "Ocultar selector" : "Seleccionar archivo"}
                            </Button>

                            <Button
                                onClick={handleAddOrUpdateDocument}
                                className="bg-brand-blue text-white"
                                disabled={(showFileInput && !docFile) || (!showFileInput && !docContent.trim())}
                            >
                                {editingDocId ? "Actualizar" : "Subir documento"}
                            </Button>
                        </div>

                        {showFileInput && (
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                                className="mt-3 border rounded px-2 py-1"
                            />
                        )}
                    </div>
                )}

                {/* Documentos */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2 text-lg">Documentos</h2>

                    {projectDocs.length === 0 ? (
                        <div className="text-muted-foreground text-center py-6 border rounded bg-muted/30">
                            No hay documentos en este proyecto.
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {projectDocs.map((doc) => (
                                <li key={doc.id} className="flex justify-between items-center py-3">
                                    <div>
                                        <span
                                            className="font-medium cursor-pointer"
                                            onClick={() => setDocumentToView(doc.content)}
                                        >
                                            {doc.name}
                                        </span>

                                        <span className="ml-2 text-xs text-muted-foreground">
                                            [{doc.type?.includes("pdf") ? "PDF" : "Texto"}]
                                        </span>
                                    </div>

                                    {(isAdmin || isTeacher || isUsuario) && (
                                        <div className="flex gap-2">

                                            {/* DESCARGAR */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const link = document.createElement("a");
                                                    link.href = doc.content;
                                                    link.download = doc.name + (doc.type?.includes("pdf") ? ".pdf" : ".txt");
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);

                                                    toast({
                                                        title: "Descarga iniciada",
                                                        description: `El documento '${doc.name}' se está descargando.`,
                                                        variant: "default",
                                                    });
                                                }}
                                            >
                                                Descargar
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingDocId(doc.id);
                                                    setDocName(doc.name);
                                                    setDocContent(doc.content);
                                                    setShowFileInput(false);
                                                }}
                                            >
                                                Editar
                                            </Button>

                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    )}

                                    {/* Modal de eliminación */}
                                    {docToDelete === doc.id && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                            <div className="bg-white p-6 rounded shadow-lg">
                                                <h3 className="font-bold text-lg mb-2">¿Eliminar documento?</h3>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setDocToDelete(null)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button variant="destructive" onClick={confirmRemoveDocument}>
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Modal visualizar */}
                {documentToView && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded shadow relative">
                            <Button className="absolute right-2 top-2" onClick={() => setDocumentToView(null)}>
                                Cerrar
                            </Button>

                            <h3 className="text-lg font-bold mb-2">Visualizar documento</h3>

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

                {/* Notas */}
                {isTeacher && (
                    <div className="mb-8">
                        <h2 className="font-semibold text-lg mb-2">Asignar nota</h2>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Nota"
                                className="border px-2 py-1 rounded w-32"
                            />

                            <Button className="bg-green-600 text-white" onClick={handleSetNote}>
                                Asignar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Admin */}
                {isAdmin && (
                    <div className="mb-8">
                        <h2 className="font-semibold text-lg mb-2">Administrar participantes</h2>
                        <Button variant="outline" className="bg-yellow-100 text-yellow-800">
                            Mover participantes (mock)
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
