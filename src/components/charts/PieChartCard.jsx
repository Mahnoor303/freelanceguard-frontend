import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#61FF8B', '#F59E0B', '#EF4444'];   // green, yellow, red

export default function PieChartCard({ data }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all duration-300">
      <h3 className="font-heading font-semibold text-white mb-4">Scan Results Distribution</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={45}
              paddingAngle={3}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ color: '#a0a0a0' }}
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-center py-10">No data yet</p>
      )}
    </div>
  );
}