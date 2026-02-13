import { JSX } from "react";


import { FileUploader } from "@/components/file-uploader.component";
import { Sidebar } from "@/components/sidebar.component";
import { useSupabase } from "@/context/supabase.context";

export function Home (): JSX.Element {
  const { currentData } = useSupabase();

  return (
    <div className="flex h-screen w-full bg-blue-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col justify-center items-center gap-8 p-8 overflow-y-auto lg:mx-30">
        <header>
          <p className="text-slate-500 mt-2 text-center">
            {currentData 
              ? `Visualizando: ${currentData.filename}` 
              : "Selecione ou faça upload de uma planilha"}
          </p>
        </header>

        <section className="w-full max-w-4xl flex justify-center items-center mx-2">
          <FileUploader />
        </section>

        {currentData && (
          <section className="w-full flex justify-center items-center">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 w-100 flex flex-col justify-center items-center">
              <p className="text-sm text-slate-500">Linhas Processadas</p>
              <p className="text-2xl font-bold">{currentData.rows.length}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
