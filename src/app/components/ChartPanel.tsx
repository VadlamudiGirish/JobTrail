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

interface ByMonth {
  month: string;
  count: number;
}
interface Totals {
  applied: number;
  interviewed: number;
  rejected: number;
}

interface Props {
  byMonth: ByMonth[];
  totals: Totals;
}

export default function ChartPanel({ byMonth, totals }: Props) {
  const [mode, setMode] = useState<"months" | "status">("months");

  const data =
    mode === "months"
      ? byMonth.map((d) => ({ label: d.month, value: d.count }))
      : [
          { label: "Applied", value: totals.applied },
          { label: "Interviewed", value: totals.interviewed },
          { label: "Rejected", value: totals.rejected },
        ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <h2 className="text-lg font-semibold">Applications</h2>
        <FilterSelect
          label="Group by"
          value={mode}
          options={["months", "status"]}
          onChange={(v) => setMode(v as "months" | "status")}
        />
      </div>

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
    </div>
  );
}
