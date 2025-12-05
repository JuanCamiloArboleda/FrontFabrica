import { useState, useEffect } from "react";
import { FileEdit, AlertTriangle, Settings, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityNotification {
  id: string;
  type: "edit" | "unauthorized_access" | "config_change";
  title: string;
  document: string;
  user: string;
  timestamp: string;
  read: boolean;
}

const mockActivityNotifications: ActivityNotification[] = [
  {
    id: "1",
    type: "edit",
    title: "Documento editado",
    document: "Proyecto_Final.pdf",
    user: "María González",
    timestamp: "2024-01-15 14:30:00",
    read: false,
  },
  {
    id: "2",
    type: "unauthorized_access",
    title: "Intento de acceso no autorizado",
    document: "Informe_Confidencial.docx",
    user: "Usuario desconocido",
    timestamp: "2024-01-15 13:15:00",
    read: false,
  },
  {
    id: "3",
    type: "edit",
    title: "Documento editado",
    document: "Presentacion_Grupo.pptx",
    user: "Carlos Ruiz",
    timestamp: "2024-01-15 11:45:00",
    read: true,
  },
  {
    id: "4",
    type: "config_change",
    title: "Permisos modificados",
    document: "Entrega_1.pdf",
    user: "Tú",
    timestamp: "2024-01-15 10:20:00",
    read: true,
  },
];

export const ActivityNotifications = () => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>(mockActivityNotifications);

  // Simular llegada de nuevas notificaciones cada 45 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: ActivityNotification = {
        id: Date.now().toString(),
        type: "edit",
        title: "Documento editado",
        document: `Documento_${Math.floor(Math.random() * 100)}.pdf`,
        user: ["María González", "Carlos Ruiz", "Ana Martínez"][Math.floor(Math.random() * 3)],
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
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: ActivityNotification["type"]) => {
    switch (type) {
      case "edit":
        return <FileEdit className="h-5 w-5 text-blue-500" />;
      case "unauthorized_access":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "config_change":
        return <Settings className="h-5 w-5 text-green-500" />;
    }
  };

  const getNotificationBadge = (type: ActivityNotification["type"]) => {
    switch (type) {
      case "edit":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Edición</Badge>;
      case "unauthorized_access":
        return <Badge variant="destructive">Alerta</Badge>;
      case "config_change":
        return <Badge variant="outline" className="text-green-500 border-green-500">Configuración</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Actividad en documentos</h3>
        <p className="text-sm text-muted-foreground">
          Historial de cambios y accesos a tus documentos compartidos
        </p>
      </div>

      <ScrollArea className="h-[500px] border rounded-md p-4">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay notificaciones de actividad
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 space-y-2 transition-colors ${
                  notification.read ? "bg-muted/20" : "bg-card border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">
                          {notification.title}
                        </h4>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>
                          <span className="font-medium text-foreground">Documento:</span>{" "}
                          {notification.document}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Usuario:</span>{" "}
                          {notification.user}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
