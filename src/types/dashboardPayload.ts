export interface DashboardPayload {
  totals: { applied: number; interviewed: number; rejected: number };
  byMonth: { month: string; count: number }[];
  byLocation: { location: string; count: number }[];
  recent: { id: string; jobTitle: string; status: string }[];
}
