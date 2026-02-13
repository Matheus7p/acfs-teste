import { Loader2, UploadCloud } from "lucide-react";
import { JSX } from "react";
import { useDropzone } from "react-dropzone";

interface IDropzoneFieldProps {
  onFileSelect: (file: File) => Promise<void>;
  disabled: boolean;
}

export const DropzoneField = ({ onFileSelect, disabled }: IDropzoneFieldProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) void onFileSelect(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative p-12 border-2 border-dashed rounded-2xl transition-all duration-200
        flex flex-col items-center justify-center gap-4 cursor-pointer
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      {disabled ? (
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      ) : (
        <UploadCloud className={`h-12 w-12 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
      )}
      <div className="text-center">
        <p className="text-lg font-semibold">
          {disabled ? "Processando..." : isDragActive ? "Solte o arquivo" : "Arraste seu Excel aqui"}
        </p>
      </div>
    </div>
  );
};
