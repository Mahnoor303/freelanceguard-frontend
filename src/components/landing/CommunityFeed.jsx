export default function CommunityFeed() {
  const reports = [
    { scammer: 'FakeClient Ltd', platform: 'Upwork', danger: 'High', time: '2 mins ago' },
    { scammer: 'BestDesigns', platform: 'Freelancer', danger: 'Medium', time: '15 mins ago' },
  ];

  return (
    <section className="bg-bg-secondary py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Live Community Reports</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {reports.map((r, i) => (
            <div key={i} className="border border-border rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-danger">{r.scammer}</p>
                <p className="text-sm text-text-secondary">{r.platform} · Danger: {r.danger}</p>
              </div>
              <span className="text-xs text-text-secondary">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}