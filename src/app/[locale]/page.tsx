"use client";

import useSWR from "swr";
import Dashboard from "@/app/components/Dashboard";
import { DashboardPayload } from "@/types/dashboardPayload";

export default function Home() {
  const { data, error } = useSWR<DashboardPayload>(
    "/api/applications/dashboard"
  );

  if (error)
    return <div className="text-red-600">Failed to load dashboard.</div>;
  if (!data) return <div>Loading…</div>;

  return <Dashboard data={data} />;
}
