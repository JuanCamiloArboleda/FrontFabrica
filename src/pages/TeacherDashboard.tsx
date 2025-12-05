import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import { useNavigate } from "react-router-dom";
import innosistemaSIcon from "@/assets/innosistemas-icon.png";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const students = [
    "Estudiante 1",
    "Estudiante 2", 
    "Estudiante 3",
    "Estudiante 4",
    "Estudiante 5",
    "Estudiante 6",
    "Estudiante 7",
    "Estudiante 8"
  ];

  const projects = [
    { id: 1, name: "Nombre proyecto" },
    { id: 2, name: "Nombre proyecto" },
    { id: 3, name: "Nombre proyecto" }
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded">
            <img 
              src={innosistemaSIcon} 
              alt="InnoSistemas Icon" 
              className="w-6 h-6 object-contain filter brightness-0 invert"
            />
          </div>
          <span className="font-medium text-lg text-gray-800">InnoSistemas</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-800">Hola, Docente</span>
          <div className="bg-white p-2 rounded border">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-200 p-4 min-h-screen">
          {/* Projects Section */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2 text-lg border-b-2 border-gray-800 pb-1">
              Proyectos
            </h2>
          </div>

          {/* Students List */}
          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-3">Listado</h3>
            <div className="bg-gray-300 rounded-2xl p-4">
              <div className="space-y-2">
                {students.map((student, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                      selectedStudent === student 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {student}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left text-gray-700 hover:bg-gray-300"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg p-6 min-h-full">
            {/* Student Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Estudiante Seleccionado:
              </label>
              <Input
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                placeholder=""
                className="w-80 bg-gray-50"
              />
            </div>

            {/* Projects Section */}
            <div>
              <h3 className="text-gray-700 font-medium mb-4">Proyectos del Estudiante:</h3>
              
              <div className="grid grid-cols-2 gap-8">
                {/* Project Selection */}
                <div>
                  <h4 className="text-gray-700 font-medium mb-3">Seleccionar Proyecto</h4>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <Card 
                        key={project.id} 
                        className={`cursor-pointer transition-colors bg-gray-400 border-none ${
                          selectedProject === project.name 
                            ? 'ring-2 ring-blue-500' 
                            : 'hover:bg-gray-300'
                        }`}
                        onClick={() => setSelectedProject(project.name)}
                      >
                        <CardContent className="p-4">
                          <p className="text-sm font-medium text-gray-800">{project.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300 rounded-xl"
                    disabled={!selectedProject}
                  >
                    Visualizar proyecto seleccionado
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300 rounded-xl"
                  >
                    Reportes
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300 rounded-xl"
                  >
                    Documentos Asociados
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default TeacherDashboard;