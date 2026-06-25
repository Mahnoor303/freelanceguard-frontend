import CircuitBackground from './CircuitBackground';   // ← ADD THIS

export default function DashboardPreview() {
  return (
    <section className="bg-bg-secondary py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-heading font-bold mb-8">Your Command Center</h2>
        <div className="max-w-4xl mx-auto bg-card-bg border border-border rounded-2xl p-6 shadow-xl neon-glow relative overflow-hidden">
          {/* Mock dashboard grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="col-span-1 bg-bg-primary p-3 rounded-lg text-sm">
              Total Scans<br />
              <span className="text-2xl font-bold text-primary">145</span>
            </div>
            <div className="col-span-1 bg-bg-primary p-3 rounded-lg text-sm">
              Risk Alerts<br />
              <span className="text-2xl font-bold text-danger">24</span>
            </div>
            <div className="col-span-1 bg-bg-primary p-3 rounded-lg text-sm">
              Safe Reports<br />
              <span className="text-2xl font-bold text-success">92</span>
            </div>
            <div className="col-span-1 bg-bg-primary p-3 rounded-lg text-sm">
              Safety Score<br />
              <span className="text-2xl font-bold text-primary">87%</span>
            </div>
          </div>
          {/* Chart placeholders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-bg-primary rounded-lg flex items-center justify-center text-text-secondary">
              📊 Pie Chart
            </div>
            <div className="h-32 bg-bg-primary rounded-lg flex items-center justify-center text-text-secondary">
              📈 Weekly Scans
            </div>
          </div>
          <CircuitBackground />
        </div>
      </div>
    </section>
  );
}