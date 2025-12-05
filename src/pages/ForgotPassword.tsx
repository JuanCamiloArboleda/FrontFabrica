import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import innosistemaSIcon from "@/assets/innosistemas-icon.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
  };

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <header className="bg-brand-navy px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={innosistemaSIcon} 
            alt="InnoSistemas Icon" 
            className="w-8 h-8 object-contain filter brightness-0 invert"
          />
          <h1 className="text-xl font-semibold text-white">
            InnoSistemas
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-sm mx-auto">
              Por favor introduce tu correo electrónico y te enviaremos un email 
              con instrucciones para restablecer tu contraseña
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="sr-only">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-surface-white border-border focus:border-brand-blue text-center"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-brand-navy hover:bg-brand-navy-light text-white font-medium tracking-wide"
            >
              SOLICITAR
            </Button>
          </form>

          {/* Back to login link */}
          <div className="text-right pt-8">
            <Link 
              to="/" 
              className="text-text-muted hover:text-brand-blue text-sm transition-colors underline"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;