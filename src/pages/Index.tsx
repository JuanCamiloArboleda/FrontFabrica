import BrandPanel from "@/components/BrandPanel";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-surface-light">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Brand */}
        <div className="hidden lg:block">
          <BrandPanel />
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile brand header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="bg-foreground text-background p-2 rounded">
                  <code className="text-sm font-mono">&lt;/&gt;</code>
                </div>
                <h1 className="text-2xl font-bold text-text-primary">Innosistemas</h1>
              </div>
            </div>
            
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
