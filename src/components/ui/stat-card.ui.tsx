import { JSX } from "react";

export const StatCard = ({ title, value, colorClass = "text-slate-900" }: { title: string, value: string | number, colorClass?: string }): JSX.Element => (
  <>
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{title}</p>
      <p className={`md:text-3xl font-black mt-2 truncate ${colorClass}`}>{value}</p>
    </div>
  </>
);
