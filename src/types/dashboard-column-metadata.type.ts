export interface IColumnMetadata {
  [key: string]: "numeric" | "temporal" | "categorical" | "empty";
}
