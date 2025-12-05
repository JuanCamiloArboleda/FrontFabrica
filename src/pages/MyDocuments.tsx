import { useState, useEffect } from "react";
import { FileText, Download, Link as LinkIcon, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface SecureLink {
  id: string;
  documentName: string;
  link: string;
  expiresAt: string;
  remainingMinutes: number;
  active: boolean;
}

interface DownloadHistory {
  id: string;
  documentName: string;
  downloadDate: string;
  result: "success" | "failed";
  reason?: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Proyecto_Final.pdf", size: "2.4 MB", uploadDate: "2024-01-15" },
  { id: "2", name: "Entrega_1.docx", size: "1.2 MB", uploadDate: "2024-01-14" },
  { id: "3", name: "Presentación.pptx", size: "5.8 MB", uploadDate: "2024-01-13" },
  { id: "4", name: "Anexos.zip", size: "12.5 MB", uploadDate: "2024-01-12" },
];

const mockDownloadHistory: DownloadHistory[] = [
  { id: "1", documentName: "Proyecto_Final.pdf", downloadDate: "2024-01-15 11:30:45", result: "success" },
  { id: "2", documentName: "Entrega_1.docx", downloadDate: "2024-01-15 10:15:22", result: "success" },
  { id: "3", documentName: "Presentación.pptx", downloadDate: "2024-01-14 16:45:10", result: "failed", reason: "Sesión expirada" },
  { id: "4", documentName: "Anexos.zip", downloadDate: "2024-01-14 09:20:33", result: "failed", reason: "Sin permisos" },
];

const MyDocuments = () => {
  const { toast } = useToast();
  const [isAuthenticated] = useState(true); // Simular estado de autenticación
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [secureLinks, setSecureLinks] = useState<SecureLink[]>([]);

  // Actualizar temporizadores de links cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setSecureLinks((prev) =>
        prev.map((link) => {
          const newRemaining = Math.max(0, link.remainingMinutes - 0.0167); // ~1 segundo
          return {
            ...link,
            remainingMinutes: newRemaining,
            active: newRemaining > 0,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateSecureLink = (doc: Document) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    setSelectedDoc(doc);
    const expirationMinutes = 5;
    const newLink: SecureLink = {
      id: Date.now().toString(),
      documentName: doc.name,
      link: `https://innosistemas.app/dl/${Date.now()}/${doc.id}`,
      expiresAt: new Date(Date.now() + expirationMinutes * 60000).toLocaleTimeString("es-ES"),
      remainingMinutes: expirationMinutes,
      active: true,
    };

    setSecureLinks((prev) => [newLink, ...prev]);
    setShowLinkDialog(true);

    toast({
      title: "Enlace generado",
      description: `Enlace válido por ${expirationMinutes} minutos`,
    });
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copiado",
      description: "Enlace copiado al portapapeles",
    });
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getResultBadge = (result: DownloadHistory["result"], reason?: string) => {
    if (result === "success") {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Exitoso
        </Badge>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Fallido
        </Badge>
        {reason && <span className="text-xs text-text-muted">{reason}</span>}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Lista de documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Archivos Disponibles</CardTitle>
              <CardDescription>
                Genera enlaces seguros de descarga para tus documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Fecha de subida</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => generateSecureLink(doc)}
                          className="flex items-center gap-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Generar enlace
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Enlaces activos */}
          {secureLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Enlaces Generados</CardTitle>
                <CardDescription>
                  Enlaces de descarga temporal con tiempo de expiración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {secureLinks.map((link) => (
                    <div
                      key={link.id}
                      className={`border rounded-lg p-4 space-y-3 ${
                        link.active ? "bg-surface-white" : "bg-surface-light opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-text-primary">{link.documentName}</p>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Clock className="h-4 w-4" />
                            {link.active ? (
                              <span className="text-primary font-semibold">
                                Expira en {formatTime(link.remainingMinutes)} min
                              </span>
                            ) : (
                              <span className="text-destructive">Enlace expirado</span>
                            )}
                          </div>
                        </div>
                        {link.active && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(link.link)}
                          >
                            Copiar enlace
                          </Button>
                        )}
                      </div>
                      <div className="bg-muted p-2 rounded text-xs font-mono truncate">
                        {link.link}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Descargas</CardTitle>
              <CardDescription>
                Registro de intentos de descarga de documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDownloadHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.documentName}</TableCell>
                      <TableCell>{item.downloadDate}</TableCell>
                      <TableCell>{getResultBadge(item.result, item.reason)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de enlace generado */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enlace de Descarga Segura</DialogTitle>
            <DialogDescription>
              Se ha generado un enlace temporal para descargar el documento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Documento</Label>
              <Input value={selectedDoc?.name || ""} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>Enlace (válido por 5 minutos)</Label>
              <div className="flex gap-2">
                <Input
                  value={secureLinks[0]?.link || ""}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(secureLinks[0]?.link || "")}
                >
                  Copiar
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Importante:</p>
                <p className="text-blue-700">
                  Este enlace expirará automáticamente en 5 minutos por seguridad.
                  Compártelo solo con destinatarios autorizados.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowLinkDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de autenticación requerida */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticación Requerida</DialogTitle>
            <DialogDescription>
              Debes iniciar sesión para generar enlaces de descarga
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 flex flex-col items-center gap-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <p className="text-center text-text-secondary">
              No tienes una sesión activa. Por favor, inicia sesión para acceder a esta funcionalidad.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAuthDialog(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MyDocuments;
