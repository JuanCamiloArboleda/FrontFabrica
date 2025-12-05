import { useState } from "react";
import { Bell, Mail, Smartphone, Monitor, Shield, CheckCircle, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

interface NotificationHistory {
  id: string;
  channel: string;
  message: string;
  status: "delivered" | "pending" | "failed";
  timestamp: string;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{ id: string; enabled: boolean } | null>(null);
  
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: "email",
      name: "Correo Electrónico",
      icon: <Mail className="h-5 w-5" />,
      enabled: true,
      description: "Recibe alertas en tu correo electrónico",
    },
    {
      id: "sms",
      name: "SMS",
      icon: <Smartphone className="h-5 w-5" />,
      enabled: false,
      description: "Recibe mensajes de texto en tu teléfono",
    },
    {
      id: "platform",
      name: "Dentro de la plataforma",
      icon: <Monitor className="h-5 w-5" />,
      enabled: true,
      description: "Notificaciones en tiempo real dentro del sistema",
    },
    {
      id: "documentEdits",
      name: "Ediciones de compañeros",
      icon: <FileEdit className="h-5 w-5" />,
      enabled: true,
      description: "Notificarme cuando un compañero edite un documento compartido",
    },
  ]);

  const [history] = useState<NotificationHistory[]>([
    {
      id: "1",
      channel: "Correo Electrónico",
      message: "Intento de acceso fallido detectado",
      status: "delivered",
      timestamp: "2024-01-15 11:30:45",
    },
    {
      id: "2",
      channel: "Plataforma",
      message: "Nueva actividad en documento compartido",
      status: "delivered",
      timestamp: "2024-01-15 10:15:22",
    },
    {
      id: "3",
      channel: "SMS",
      message: "Cambio de configuración de seguridad",
      status: "pending",
      timestamp: "2024-01-15 09:45:10",
    },
    {
      id: "4",
      channel: "Correo Electrónico",
      message: "Acceso desde nueva ubicación",
      status: "failed",
      timestamp: "2024-01-14 16:20:33",
    },
  ]);

  const handleToggleChange = (channelId: string, newState: boolean) => {
    setPendingChange({ id: channelId, enabled: newState });
    setShowConfirmDialog(true);
  };

  const confirmChange = () => {
    if (pendingChange) {
      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === pendingChange.id ? { ...ch, enabled: pendingChange.enabled } : ch
        )
      );

      toast({
        title: "Configuración actualizada",
        description: "Los cambios en las notificaciones se han guardado correctamente",
      });
    }
    setShowConfirmDialog(false);
    setPendingChange(null);
  };

  const getStatusBadge = (status: NotificationHistory["status"]) => {
    const variants = {
      delivered: { variant: "default" as const, label: "Entregada", color: "text-green-600" },
      pending: { variant: "secondary" as const, label: "Pendiente", color: "text-orange-500" },
      failed: { variant: "destructive" as const, label: "Fallida", color: "text-destructive" },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" />
          Configuración de Notificaciones
        </h1>
        <p className="text-text-secondary">
          Personaliza cómo y cuándo recibir alertas de seguridad
        </p>
      </div>

      {/* Canales de notificación */}
      <Card>
        <CardHeader>
          <CardTitle>Canales de Notificación</CardTitle>
          <CardDescription>
            Activa o desactiva los diferentes métodos de notificación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {channel.icon}
                </div>
                <div>
                  <Label htmlFor={channel.id} className="text-base font-semibold cursor-pointer">
                    {channel.name}
                  </Label>
                  <p className="text-sm text-text-secondary">
                    {channel.description}
                  </p>
                </div>
              </div>
              <Switch
                id={channel.id}
                checked={channel.enabled}
                onCheckedChange={(checked) => handleToggleChange(channel.id, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Historial de notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
          <CardDescription>
            Registro de notificaciones enviadas recientemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-text-primary">{item.message}</p>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      {item.channel}
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
                <div>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de configuración</DialogTitle>
            <DialogDescription>
              Se requiere autenticación para modificar la configuración de notificaciones
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center p-8 bg-primary/10 rounded-lg">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <p className="text-center text-sm text-text-secondary">
              Esta acción modificará cómo recibes las alertas de seguridad
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmChange} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationSettings;
