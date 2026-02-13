import { JSX } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { formatBRL } from "@/utils/formatBRL.utils";

interface IBarChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export const BarChartCard = ({ title, data }: IBarChartProps): JSX.Element => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-w-0 h-full">
      <h3 className="text-slate-600 font-bold mb-4">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number) => [formatBRL(value), "Vendas"]}
              cursor={{ fill: "#f8fafc" }}
            />
            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
