import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChartCard({ data }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all duration-300">
      <h3 className="font-heading font-semibold text-white mb-4">Weekly Scans</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="day" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(97,255,139,0.05)' }}
            />
            <Bar
              dataKey="scans"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#61FF8B" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#61FF8B" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-center py-10">No data yet</p>
      )}
    </div>
  );
}