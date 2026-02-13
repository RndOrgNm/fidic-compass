import { FUNDS_API_BASE_URL } from "./config";

export type CreditAnalysisStatus =
  | "pending_documents"
  | "in_analysis"
  | "approved"
  | "rejected";

export type Segment =
  | "comercio"
  | "industria"
  | "servicos"
  | "agronegocio"
  | "varejo"
  | "insumos";

export interface Receivable {
  id: string;
  cedente_id: string;
  invoice_number: string;
  nominal_value: number;
  due_date: string;
  debtor_name: string;
  debtor_cnpj: string;
  credit_analysis_status: CreditAnalysisStatus;
  risk_score: number;
  segment: Segment;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReceivableListResponse {
  items: Receivable[];
  total: number;
}

export interface ReceivableFilters {
  cedente_id?: string;
  status?: CreditAnalysisStatus;
  segment?: Segment;
  limit?: number;
  offset?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : errorData.detail?.[0]?.msg || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function listReceivables(
  filters: ReceivableFilters = {}
): Promise<ReceivableListResponse> {
  const params = new URLSearchParams();
  if (filters.cedente_id) params.set("cedente_id", filters.cedente_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.segment) params.set("segment", filters.segment);
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.offset != null) params.set("offset", String(filters.offset));

  const qs = params.toString();
  const url = `${FUNDS_API_BASE_URL}/receivables${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<ReceivableListResponse>(response);
}
