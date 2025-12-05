import { useState } from "react";
import { Shield, Lock, Unlock, Eye, Download, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  encrypted: boolean;
  owner: string;
  size: string;
  lastModified: string;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  document: string;
  timestamp: string;
  status: "success" | "denied" | "warning";
}

// Mock data
const mockDocuments: Document[] = [
  { id: "1", name: "Proyecto_Final.pdf", encrypted: true, owner: "Juan Pérez", size: "2.4 MB", lastModified: "2024-01-15 10:30" },
  { id: "2", name: "Entrega_1.docx", encrypted: false, owner: "María García", size: "1.2 MB", lastModified: "2024-01-14 15:45" },
  { id: "3", name: "Presentación.pptx", encrypted: true, owner: "Carlos López", size: "5.8 MB", lastModified: "2024-01-13 09:20" },
  { id: "4", name: "Anexos.zip", encrypted: true, owner: "Ana Martínez", size: "12.5 MB", lastModified: "2024-01-12 14:10" },
];

const mockActivityLogs: ActivityLog[] = [
  { id: "1", user: "admin@inno.com", action: "Descarga", document: "Proyecto_Final.pdf", timestamp: "2024-01-15 11:30:45", status: "success" },
  { id: "2", user: "usuario@test.com", action: "Intento de acceso", document: "Entrega_1.docx", timestamp: "2024-01-15 11:25:12", status: "denied" },
  { id: "3", user: "docente@inno.com", action: "Edición", document: "Presentación.pptx", timestamp: "2024-01-15 10:15:33", status: "success" },
  { id: "4", user: "estudiante@test.com", action: "Visualización", document: "Anexos.zip", timestamp: "2024-01-15 09:45:22", status: "warning" },
  { id: "5", user: "admin@inno.com", action: "Eliminación", document: "Borrador.txt", timestamp: "2024-01-14 16:20:10", status: "success" },
];

const DocumentSecurity = () => {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [actionType, setActionType] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSecureConnection] = useState(true); // Simular verificación HTTPS

  const handleAction = (doc: Document, action: string) => {
    setSelectedDoc(doc);
    setActionType(action);
    setDialogOpen(true);
  };

  const confirmAction = (hasPermission: boolean) => {
    setDialogOpen(false);
    
    if (hasPermission) {
      toast({
        title: "Acceso concedido",
        description: `${actionType} realizado en ${selectedDoc?.name}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Acceso denegado",
        description: `No tienes permisos para ${actionType.toLowerCase()} este documento`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: ActivityLog["status"]) => {
    const variants = {
      success: { variant: "default" as const, label: "Exitoso" },
      denied: { variant: "destructive" as const, label: "Denegado" },
      warning: { variant: "secondary" as const, label: "Advertencia" },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="p-6">
      {/* Header con advertencia de seguridad */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Seguridad de Documentos</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona y protege el acceso a tus documentos
            </p>
          </div>
          
          {isSecureConnection ? (
            <Badge className="bg-green-500 text-white">
              <Lock className="h-4 w-4 mr-1" />
              Conexión segura (HTTPS)
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Conexión no segura
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Protegidos</CardTitle>
              <CardDescription>
                Lista de documentos con sus niveles de seguridad y acciones disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Última modificación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        {doc.encrypted ? (
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-green-600" />
                            <span className="sr-only">Documento cifrado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Unlock className="h-5 w-5 text-orange-500" />
                            <span className="sr-only">Documento sin cifrar</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.owner}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(doc, "Ver")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(doc, "Descargar")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(doc, "Editar")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(doc, "Eliminar")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Actividad</CardTitle>
              <CardDescription>
                Historial de acciones realizadas en el sistema (solo visible para administradores)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.document}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de validación de permisos */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validación de Permisos</DialogTitle>
            <DialogDescription>
              ¿Tienes permiso para realizar esta acción?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-text-secondary">
              Acción solicitada: <span className="font-semibold text-text-primary">{actionType}</span>
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Documento: <span className="font-semibold text-text-primary">{selectedDoc?.name}</span>
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => confirmAction(false)}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Acceso Denegado
            </Button>
            <Button
              onClick={() => confirmAction(true)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Acceso Concedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentSecurity;
