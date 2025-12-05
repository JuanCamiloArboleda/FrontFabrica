import { useState } from "react";
import { Search, User, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const AdminUserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Juan Pérez", email: "juan@ejemplo.com", role: "Docente", status: "active" },
    { id: 2, name: "María García", email: "maria@ejemplo.com", role: "Estudiante", status: "active" },
    { id: 3, name: "Carlos López", email: "carlos@ejemplo.com", role: "Estudiante", status: "inactive" },
    { id: 4, name: "Ana Martínez", email: "ana@ejemplo.com", role: "Docente", status: "active" },
  ]);
  
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getSelectedUser = () => {
    if (selectedUsers.length === 1) {
      return users.find(user => user.id === selectedUsers[0]);
    }
    return null;
  };

  const handleToggleUserStatus = () => {
    const selectedUser = getSelectedUser();
    if (selectedUser) {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      ));
      setSelectedUsers([]);
      setIsToggleDialogOpen(false);
    }
  };

  const handleCreateUser = () => {
    if (newUserName && newUserEmail && newUserRole) {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: "active"
      };
      setUsers(prev => [...prev, newUser]);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("");
      setIsCreateDialogOpen(false);
    }
  };

  const selectedUser = getSelectedUser();
  const canToggleStatus = selectedUsers.length === 1;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-light">
      {/* Header */}
      <header className="bg-surface-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-text-primary">gestión de usuarios</h1>
          <Button variant="outline" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuarios"
              className="pl-10 bg-surface-white border-border"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Dialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={!canToggleStatus}
                  className="bg-surface-white"
                >
                  {selectedUser?.status === "active" ? "Desactivar usuario" : "Activar usuario"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar acción</DialogTitle>
                  <DialogDescription>
                    ¿Está seguro de {selectedUser?.status === "active" ? "desactivar" : "activar"} este usuario?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsToggleDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleToggleUserStatus}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear nuevo usuario</DialogTitle>
                  <DialogDescription>
                    Ingrese los datos del nuevo usuario
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Nombre de usuario</Label>
                    <Input
                      id="userName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ingrese el nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Ingrese el email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userRole">Rol</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Docente">Docente</SelectItem>
                        <SelectItem value="Estudiante">Estudiante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser} disabled={!newUserName || !newUserEmail || !newUserRole}>
                    Crear
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-surface-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="text-left p-4 font-medium text-text-secondary">
                      <Checkbox 
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(users.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-text-secondary">Nombre</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Email</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Rol</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Estado</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/20">
                      <td className="p-4">
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </td>
                      <td className="p-4 text-text-primary font-medium">{user.name}</td>
                      <td className="p-4 text-text-secondary">{user.email}</td>
                      <td className="p-4 text-text-secondary">{user.role}</td>
                      <td className="p-4">
                        <Badge 
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUserManagement;