import { JSX } from "react";

import { processDashboardValue } from "@/hooks/use-dashboard-metrics";
import { formatBRL } from "@/utils/formatBRL.utils";

interface IProductTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  valueKey: string;
  categoryKey: string;
}

export const ProductTable = ({ data, valueKey, categoryKey }: IProductTableProps): JSX.Element => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Produtos Filtrados</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Mês</th>
              <th className="px-6 py-4">Qtd</th>
              <th className="px-6 py-4">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 10).map((row, idx) => {
              const mesKey = Object.keys(row).find(k => k.toUpperCase() === "MES") || "Mes";
              const qtdKey = Object.keys(row).find(k => k.toUpperCase() === "QUANTIDADE" || k.toUpperCase() === "QTD") || "Quantidade";
              const prodKey = Object.keys(row).find(k => k.toUpperCase() === "PRODUTO") || "Produto";

              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors text-sm text-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900">{row[prodKey]}</td>
                  <td className="px-6 py-4">{row[categoryKey]}</td>
                  <td className="px-6 py-4">{row[mesKey]}</td>
                  <td className="px-6 py-4 font-mono">{row[qtdKey]}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatBRL(processDashboardValue(row[valueKey]))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
