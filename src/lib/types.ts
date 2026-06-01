// ── Project types ──────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ProjectStatus = "complete" | "in-progress" | "placeholder";

export type DataClient =
  | "Upcare Diagnostics"
  | "PUDC"
  | "One Health Medical"
  | "ARDI Health Services"
  | "Klinik dr. Hondo Supeno"
  | "All Clients"
  | "Kalix";

export type TableName =
  | "patients"
  | "orders"
  | "order_items"
  | "patient_services"
  | "patient_service_results";

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
  color: string; // tailwind bg class for card accent
}

// ── Chart data types ───────────────────────────────────────────────────────

export interface BarDataPoint {
  label: string;
  value: number;
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

// ── Project page data shape ────────────────────────────────────────────────

export interface ProjectData {
  meta: ProjectMeta;
  businessProblem: {
    summary: string;
    context: string[];
    operationalImpact: string;
  };
  dataSources: {
    clients: DataClient[];
    tables: {
      name: TableName;
      fieldsUsed: string[];
      notes?: string;
    }[];
    rowCount?: number;
    dateRange?: string;
  };
  methodology: {
    approach: string;
    steps: string[];
    models: string[];
    validationMethod: string;
  };
  results: {
    kpis: KPIData[];
    charts: unknown[]; // populated per project
    keyFindings: string[];
    limitations: string[];
  };
  insights: string[];
  futureImprovements: string[];
}
