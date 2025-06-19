"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import FilterSelect from "./FilterSelect";

type GroupBy = "months" | "status" | "location";

interface ByMonth {
  month: string;
  count: number;
}
interface ByLocation {
  location: string;
  count: number;
}
interface Totals {
  applied: number;
  interviewed: number;
  rejected: number;
}

interface Props {
  byMonth: ByMonth[];
  byLocation: ByLocation[];
  totals: Totals;
}

export default function ChartPanel({ byMonth, byLocation, totals }: Props) {
  const [mode, setMode] = useState<GroupBy>("months");

  const data =
    mode === "months"
      ? byMonth.map((d) => ({ label: d.month, value: d.count }))
      : mode === "status"
      ? [
          { label: "Applied", value: totals.applied },
          { label: "Interviewed", value: totals.interviewed },
          { label: "Rejected", value: totals.rejected },
        ]
      : byLocation.map((d) => ({ label: d.location, value: d.count }));

  const hasData = data.length > 0 && data.some((d) => d.value > 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <h2 className="text-lg font-semibold">Applications</h2>
        <FilterSelect<GroupBy>
          label="Group by"
          value={mode}
          options={["months", "status", "location"]}
          onChange={setMode}
        />
      </div>

      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data to display.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
