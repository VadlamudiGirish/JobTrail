"use client";

import useSWR from "swr";
import Dashboard, { DashboardPayload } from "@/app/components/Dashboard";

export default function Home() {
  const { data, error } = useSWR<DashboardPayload>(
    "/api/applications/dashboard"
  );

  if (error)
    return <div className="text-red-600">Failed to load dashboard.</div>;
  if (!data) return <div>Loading…</div>;

  return <Dashboard data={data} />;
}
