import { JSX } from "react";

import { FileUploader } from "./components/file-uploader.component";

export function App (): JSX.Element {
  return (
    <>
      <main className="h-screen bg-blue-200 flex flex-col justify-center items-center gap-8">
        <h1 className="font-bold text-4xl">Teste Técnico</h1>
        <FileUploader /> 
      </main>
    </>
  );
}
