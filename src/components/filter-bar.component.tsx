import { JSX } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IFilterBarProps {
  categories: string[];
  months: string[];
  filters: { categoria: string; mes: string };
  setFilters: (filters: any) => void;
  onClear: () => void;
}

export const FilterBar = ({ categories, months, filters, setFilters, onClear }: IFilterBarProps): JSX.Element => {
  return (
    <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-2 flex-1 min-w-50">
        <label 
          htmlFor="category-select"
          className="text-xs font-bold text-slate-500"
        >
          Filtrar Categoria
        </label>
        <select 
          id="category-select"
          value={filters.categoria}
          onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
          className="..."
        >
          <option value="all">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-50">
        <label 
          htmlFor="month-select"
          className="text-xs font-bold text-slate-500"
        >
          Filtrar Mês
        </label>
        <select 
          id="month-select"
          value={filters.mes}
          onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
          className="..."
        >
          <option value="all">Todos os meses</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={onClear}
        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2 rounded-lg font-bold text-sm transition-all border border-slate-200 hover:cursor-pointer"
      >
        Limpar Filtros
      </button>
    </section>
  );
};
