import { IColumnMetadata } from "./dashboard-column-metadata.type";
import { IDashboardRow } from "./dashboard-row.type";

export interface IDashboardData {
  id: string;
  filename: string;
  metadata: IColumnMetadata;
  rows: IDashboardRow[];
  uploaded_at: string;
}
