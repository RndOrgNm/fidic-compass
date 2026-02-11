import { FUNDS_API_BASE_URL } from "./config";

// ── Enums ──────────────────────────────────────────────────────────────────────

export type ProspectionStatus =
  | "lead"
  | "contact"
  | "documents"
  | "credit_analysis"
  | "approved"
  | "rejected";

export type ProspectionStep =
  | "initial_contact"
  | "proposal_sent"
  | "document_collection"
  | "risk_assessment"
  | "committee_review"
  | "completed";

export type Segment =
  | "comercio"
  | "industria"
  | "servicos"
  | "agronegocio"
  | "varejo"
  | "insumos";

// ── Response types ─────────────────────────────────────────────────────────────

export interface ProspectionWorkflow {
  id: string;
  cedente_id: string;
  receivable_id: string | null;
  status: ProspectionStatus;
  current_step: ProspectionStep;
  assigned_to: string | null;
  pending_items: string[];
  sla_deadline: string | null;
  estimated_volume: number;
  created_at: string;
  updated_at: string;
  cedente_name: string | null;
  cedente_cnpj: string | null;
  cedente_segment: Segment | null;
  receivable_value: number;
  total_steps: number;
  completed_steps: number;
  days_in_progress: number;
}

export interface ProspectionWorkflowListResponse {
  items: ProspectionWorkflow[];
  total: number;
}

export interface NewLeadCreate {
  company_name: string;
  cnpj: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  segment: Segment;
  estimated_volume: number;
  assigned_to?: string | null;
}

export interface NewLeadResponse {
  cedente_id: string;
  workflow_id: string;
  company_name: string;
  cnpj: string;
  segment: Segment;
  status: ProspectionStatus;
  estimated_volume: number;
}

export interface TransitionRequest {
  status: ProspectionStatus;
  current_step?: ProspectionStep;
  pending_items?: string[];
}

export interface AssignRequest {
  assigned_to: string;
}

// ── Filters ────────────────────────────────────────────────────────────────────

export interface WorkflowFilters {
  status?: ProspectionStatus;
  assigned_to?: string;
  cedente_id?: string;
  segment?: Segment;
  limit?: number;
  offset?: number;
}

// ── Helper ─────────────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// ── API functions ──────────────────────────────────────────────────────────────

export async function listProspectionWorkflows(
  filters: WorkflowFilters = {}
): Promise<ProspectionWorkflowListResponse> {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.assigned_to) params.set("assigned_to", filters.assigned_to);
  if (filters.cedente_id) params.set("cedente_id", filters.cedente_id);
  if (filters.segment) params.set("segment", filters.segment);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  const qs = params.toString();
  const url = `${FUNDS_API_BASE_URL}/prospection${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<ProspectionWorkflowListResponse>(response);
}

export async function createNewLead(
  data: NewLeadCreate
): Promise<NewLeadResponse> {
  const response = await fetch(`${FUNDS_API_BASE_URL}/prospection/new-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse<NewLeadResponse>(response);
}

export async function transitionWorkflow(
  workflowId: string,
  data: TransitionRequest
): Promise<ProspectionWorkflow> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/prospection/${workflowId}/transition`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<ProspectionWorkflow>(response);
}

export async function assignWorkflow(
  workflowId: string,
  assignedTo: string
): Promise<ProspectionWorkflow> {
  const response = await fetch(
    `${FUNDS_API_BASE_URL}/prospection/${workflowId}/assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to: assignedTo } as AssignRequest),
    }
  );

  return handleResponse<ProspectionWorkflow>(response);
}
