import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Check } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "María González", email: "maria@example.com" },
  { id: "2", name: "Carlos Ruiz", email: "carlos@example.com" },
  { id: "3", name: "Ana Martínez", email: "ana@example.com" },
  { id: "4", name: "Pedro López", email: "pedro@example.com" },
  { id: "5", name: "Laura Sánchez", email: "laura@example.com" },
];

export const ShareDocumentModal = ({ isOpen, onClose, documentName }: ShareDocumentModalProps) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [permissions, setPermissions] = useState<Record<string, "read" | "edit">>({});
  const { toast } = useToast();

  const toggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
      const newPermissions = { ...permissions };
      delete newPermissions[memberId];
      setPermissions(newPermissions);
    } else {
      newSelected.add(memberId);
      setPermissions({ ...permissions, [memberId]: "read" });
    }
    setSelectedMembers(newSelected);
  };

  const setPermission = (memberId: string, permission: "read" | "edit") => {
    setPermissions({ ...permissions, [memberId]: permission });
  };

  const handleShare = () => {
    if (selectedMembers.size === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un compañero",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Documento compartido exitosamente",
      description: `Compartido con ${selectedMembers.size} miembro${selectedMembers.size > 1 ? "s" : ""}`,
    });
    
    setSelectedMembers(new Set());
    setPermissions({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartir documento</DialogTitle>
          <DialogDescription>
            Documento: <span className="font-medium text-foreground">{documentName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Selecciona compañeros:</p>
            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              {mockTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  {selectedMembers.has(member.id) && (
                    <Select
                      value={permissions[member.id]}
                      onValueChange={(value: "read" | "edit") => setPermission(member.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Lectura</SelectItem>
                        <SelectItem value="edit">Edición</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedMembers.size > 0 && (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm text-muted-foreground">
                {selectedMembers.size} compañero{selectedMembers.size > 1 ? "s" : ""} seleccionado
                {selectedMembers.size > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleShare}>
            <Check className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
