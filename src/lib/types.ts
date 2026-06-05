// ── Project types ──────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ProjectStatus = "complete" | "in-progress" | "placeholder";

// Synthetic site labels (data is fabricated — no real client names)
export type DataClient = string;

export type TableName =
  | "patients"
  | "orders"
  | "order_items"
  | "patient_services"
  | "patient_service_results"
  | "support_tickets"
  | "soap_analytics";

export interface ProjectMeta {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  status: ProjectStatus;
  clients: DataClient[];
  tables: TableName[];
  techniques: string[];
  keyMetric?: {
    value: string;
    label: string;
  };
  color: string;
}

// ── Chart data types ───────────────────────────────────────────────────────

export interface BarDataPoint {
  label: string;
  value: number;
  n?: number;
  color?: string;
}

export interface LineDataPoint {
  x: string | number;
  y: number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  cluster?: number;
}

export interface KPIData {
  value: string | number;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
}
