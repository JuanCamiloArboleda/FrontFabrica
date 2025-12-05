import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SharedAccess {
  id: string;
  name: string;
  email: string;
  permission: "read" | "edit";
}

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

const mockSharedAccess: SharedAccess[] = [
  { id: "1", name: "María González", email: "maria@example.com", permission: "edit" },
  { id: "2", name: "Carlos Ruiz", email: "carlos@example.com", permission: "read" },
  { id: "3", name: "Ana Martínez", email: "ana@example.com", permission: "edit" },
];

export const ManageAccessModal = ({ isOpen, onClose, documentName }: ManageAccessModalProps) => {
  const [accesses, setAccesses] = useState<SharedAccess[]>(mockSharedAccess);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const { toast } = useToast();

  const updatePermission = (userId: string, newPermission: "read" | "edit") => {
    setAccesses(accesses.map(access => 
      access.id === userId ? { ...access, permission: newPermission } : access
    ));
    toast({
      title: "Permiso actualizado",
      description: "Los permisos se actualizaron correctamente",
    });
  };

  const removeAccess = (userId: string) => {
    setAccesses(accesses.filter(access => access.id !== userId));
    toast({
      title: "Acceso removido",
      description: "El usuario ya no tiene acceso al documento",
    });
    setUserToRemove(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gestionar accesos</DialogTitle>
            <DialogDescription>
              Documento: <span className="font-medium text-foreground">{documentName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {accesses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay compañeros con acceso a este documento
              </p>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Compañero</th>
                      <th className="text-left p-3 text-sm font-medium text-foreground">Permiso</th>
                      <th className="text-center p-3 text-sm font-medium text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accesses.map((access) => (
                      <tr key={access.id} className="border-t hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{access.name}</p>
                              <p className="text-xs text-muted-foreground">{access.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Select
                            value={access.permission}
                            onValueChange={(value: "read" | "edit") => updatePermission(access.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">Lectura</SelectItem>
                              <SelectItem value="edit">Edición</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setUserToRemove(access.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Remover acceso?</AlertDialogTitle>
            <AlertDialogDescription>
              Este usuario ya no podrá acceder al documento. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToRemove && removeAccess(userToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
