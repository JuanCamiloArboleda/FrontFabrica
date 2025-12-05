const Activity = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-light">
      {/* Header */}
      <header className="bg-surface-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-text-primary">actividad</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="text-center py-12">
          <p className="text-text-secondary">No hay actividad reciente</p>
        </div>
      </main>
    </div>
  );
};

export default Activity;