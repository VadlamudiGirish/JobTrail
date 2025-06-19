"use client";

import StatsCard from "./StatsCard";
import ChartPanel from "./ChartPanel";
import { useRouter } from "next/navigation";

export interface DashboardPayload {
  totals: { applied: number; interviewed: number; rejected: number };
  byMonth: { month: string; count: number }[];
  recent: { id: string; jobTitle: string; status: string }[];
}

interface DashboardProps {
  data: DashboardPayload;
}

export default function Dashboard({ data }: DashboardProps) {
  const { totals, byMonth, recent } = data;
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard label="Applied" count={totals.applied} />
          <StatsCard label="Interviewed" count={totals.interviewed} />
          <StatsCard label="Rejected" count={totals.rejected} />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <ChartPanel byMonth={byMonth} totals={totals} />
        </div>
      </div>

      <div className="w-full lg:w-1/3 space-y-4">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
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
      </div>
    </div>
  );
}
