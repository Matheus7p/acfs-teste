import { JSX } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

import { formatBRL } from "@/utils/formatBRL.utils";

const COLORS = ["#0d9488", "#2563eb", "#ea580c", "#7c3aed", "#db2777"];

interface IPieChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export const PieChartCard = ({ title, data }: IPieChartProps): JSX.Element => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-w-0 h-full">
      <h3 className="text-slate-600 font-bold mb-4">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="90%" height="90%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => formatBRL(val)} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
