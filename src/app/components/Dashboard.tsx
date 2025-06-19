"use client";

import { useRouter } from "next/navigation";
import StatsCard from "./StatsCard";
import ChartPanel from "./ChartPanel";

export interface DashboardPayload {
  totals: { applied: number; interviewed: number; rejected: number };
  byMonth: { month: string; count: number }[];
  recent: { id: string; jobTitle: string; status: string }[];
}

interface DashboardProps {
  data?: DashboardPayload;
}

export default function Dashboard({ data }: DashboardProps) {
  const router = useRouter();

  const totals = data?.totals ?? { applied: 0, interviewed: 0, rejected: 0 };
  const byMonth = data?.byMonth ?? [];
  const recent = data?.recent ?? [];

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-12">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard label="Applied" count={totals.applied} />
          <StatsCard label="Interviewed" count={totals.interviewed} />
          <StatsCard label="Rejected" count={totals.rejected} />
        </div>
        <ChartPanel byMonth={byMonth} totals={totals} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Applications</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500">No recent applications.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Job Title</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/en/applications/${r.id}`)}
                    className="cursor-pointer hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{r.jobTitle}</td>
                    <td className="px-4 py-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
