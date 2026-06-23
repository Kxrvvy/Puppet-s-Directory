import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
        <XAxis dataKey="day" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
        <YAxis fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
        <Tooltip cursor={{fill: '#f5f5f5'}} />
        <Bar dataKey="sales" fill="#404040" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}