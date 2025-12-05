import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Shield, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Notification {
  id: string;
  type: "failed_attempt" | "suspicious_access" | "config_change";
  title: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "failed_attempt",
    title: "Intento de acceso fallido",
    resource: "Documento: Proyecto_Final.pdf",
    ipAddress: "192.168.1.100",
    timestamp: "2024-01-15 11:30:45",
    read: false,
  },
  {
    id: "2",
    type: "suspicious_access",
    title: "Acceso desde ubicación no reconocida",
    resource: "Tu cuenta",
    ipAddress: "203.45.67.89",
    timestamp: "2024-01-15 10:15:22",
    read: false,
  },
  {
    id: "3",
    type: "config_change",
    title: "Configuración de seguridad modificada",
    resource: "Preferencias de notificación",
    ipAddress: "192.168.1.50",
    timestamp: "2024-01-15 09:45:10",
    read: true,
  },
];

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Simular llegada de nuevas notificaciones cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "suspicious_access",
        title: "Nueva actividad detectada",
        resource: "Documento: Entrega_" + Math.floor(Math.random() * 10) + ".pdf",
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date().toLocaleString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "failed_attempt":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "suspicious_access":
        return <Shield className="h-5 w-5 text-orange-500" />;
      case "config_change":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notificaciones de Seguridad</SheetTitle>
          <SheetDescription>
            Alertas sobre acceso a tu cuenta y documentos
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-text-muted py-8">
                No hay notificaciones
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 space-y-2 ${
                    notification.read ? "bg-surface-light" : "bg-surface-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <h4 className="font-semibold text-sm text-text-primary">
                        {notification.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm space-y-1 text-text-secondary">
                    <p>
                      <span className="font-medium">Recurso:</span> {notification.resource}
                    </p>
                    <p>
                      <span className="font-medium">IP:</span> {notification.ipAddress}
                    </p>
                    <p>
                      <span className="font-medium">Hora:</span> {notification.timestamp}
                    </p>
                  </div>

                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Marcar como leído
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
