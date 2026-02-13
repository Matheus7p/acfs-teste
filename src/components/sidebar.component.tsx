import { FileText, Loader2, Menu, X, Calendar } from "lucide-react";
import { JSX } from "react";

import { useSidebarControls } from "@/hooks/use-sidebar-controls";
import { useSidebarData } from "@/hooks/use-sidebar-data";

export const Sidebar = (): JSX.Element => {
  const { uploads, isLoading, selectedId, handleSelect } = useSidebarData();
  const { isOpen, toggle, close } = useSidebarControls();

  const onSelectFile = (id: string): undefined => {
    handleSelect(id);
    close();
    return undefined;
  };

  return (
    <>
      <button
        onClick={toggle}
        className={`lg:hidden fixed top-4 z-50 p-2 hover:scale-105 duration-300 hover:cursor-pointer ${
          isOpen ? "left-71" : "left-4" 
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm hover:scale-105 duration-300 hover:cursor-pointer" 
          onClick={close}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 px-8 border-b">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Histórico</h2>
            <p className="text-xs text-slate-500 font-medium">Arquivos processados</p>
          </div>
          <nav className="flex-1 overflow-y-auto flex flex-col gap-2 p-2 px-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : uploads.length === 0 ? (
              <p className="text-sm text-center text-slate-400 py-10 font-medium">Nenhum histórico</p>
            ) : (
              uploads.map((item) => (
                <button
                  key={item.id}
                  onClick={(): undefined => onSelectFile(item.id)}
                  className={`
                    w-full flex items-center gap-2 p-0.5 text-left transition-all 
                    hover:cursor-pointer group rounded-sm
                    ${selectedId === item.id 
                  ? "bg-blue-600/20 shadow-lg shadow-blue-100" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"}
                  `}
                >
                  <div className="p-2.5 rounded-xl shrink-0 transition-colors">
                    <FileText className="h-5 w-5 text-black/40"/>
                  </div>
                  
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate mb-1 text-black/40">
                      {item.filename}
                    </p>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <Calendar className="h-3.5 w-3.5 text-black/40" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-black/40">
                        {new Date(item.uploaded_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};
