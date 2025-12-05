import innosistemaSIcon from "@/assets/innosistemas-icon.png";

const BrandPanel = () => {
  return (
    <div className="bg-brand-navy min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-sm space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <img 
            src={innosistemaSIcon} 
            alt="InnoSistemas Icon" 
            className="w-32 h-32 object-contain filter brightness-0 invert"
          />
        </div>
        
        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-white tracking-tight">
          InnoSistemas
        </h1>
        
        {/* Description */}
        <p className="text-lg text-blue-200 leading-relaxed">
          Plataforma de integración y desarrollo de software para estudiantes de Ingeniería de Sistemas.
        </p>
      </div>
    </div>
  );
};

export default BrandPanel;