import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, Shield, FileText, Bell } from "lucide-react";
import MyDocuments from "./MyDocuments";
import DocumentSecurity from "./DocumentSecurity";
import { ShareDocumentModal } from "@/components/ShareDocumentModal";
import { ManageAccessModal } from "@/components/ManageAccessModal";
import { ActivityNotifications } from "@/components/ActivityNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for shared documents
const mockSharedDocuments = [
  {
    id: "1",
    name: "Proyecto_Grupal.pdf",
    sharedBy: "María González",
    sharedDate: "2024-01-15",
    permission: "edit" as const,
  },
  {
    id: "2",
    name: "Presentacion_Final.pptx",
    sharedBy: "Carlos Ruiz",
    sharedDate: "2024-01-14",
    permission: "read" as const,
  },
  {
    id: "3",
    name: "Informe_Investigacion.docx",
    sharedBy: "Ana Martínez",
    sharedDate: "2024-01-13",
    permission: "edit" as const,
  },
];

const DocumentsHub = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [manageAccessModalOpen, setManageAccessModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");

  const openShareModal = (docName: string) => {
    setSelectedDocument(docName);
    setShareModalOpen(true);
  };

  const openManageAccessModal = (docName: string) => {
    setSelectedDocument(docName);
    setManageAccessModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tus documentos, permisos y actividad
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs defaultValue="shared-with-me" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="shared-with-me" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Compartidos conmigo</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartir</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Actividad</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shared-with-me">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Documentos compartidos conmigo
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Documentos que otros compañeros han compartido contigo
                  </p>
                </div>

                {mockSharedDocuments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No tienes documentos compartidos
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-foreground">Documento</th>
                          <th className="text-left p-3 text-sm font-medium text-foreground">Compartido por</th>
                          <th className="text-left p-3 text-sm font-medium text-foreground">Fecha</th>
                          <th className="text-left p-3 text-sm font-medium text-foreground">Permiso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockSharedDocuments.map((doc) => (
                          <tr key={doc.id} className="border-t hover:bg-muted/20">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium text-foreground">{doc.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">{doc.sharedBy}</td>
                            <td className="p-3 text-muted-foreground">{doc.sharedDate}</td>
                            <td className="p-3">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  doc.permission === "edit"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {doc.permission === "edit" ? "Edición" : "Lectura"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="share">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Compartir documentos</h2>
                  <p className="text-sm text-muted-foreground">
                    Comparte tus documentos con compañeros de equipo
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {["Proyecto_Final.pdf", "Entrega_1.docx", "Presentacion.pptx"].map((doc, idx) => (
                    <Card key={idx} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{doc}</h3>
                          <p className="text-xs text-muted-foreground mt-1">2.5 MB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => openShareModal(doc)}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Compartir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => openManageAccessModal(doc)}
                        >
                          Gestionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <DocumentSecurity />
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6">
              <ActivityNotifications />
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ShareDocumentModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        documentName={selectedDocument}
      />

      <ManageAccessModal
        isOpen={manageAccessModalOpen}
        onClose={() => setManageAccessModalOpen(false)}
        documentName={selectedDocument}
      />
    </div>
  );
};

export default DocumentsHub;
