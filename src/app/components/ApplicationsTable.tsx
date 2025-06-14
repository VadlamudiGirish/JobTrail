"use client";

import TableRow from "./TableRow";
import { Application } from "@/types/application";

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white divide-y divide-gray-200 text-sm sm:text-base">
        <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Job Title
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Date
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Location
            </th>
            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applications.map((application) => (
            <TableRow key={application.id} application={application} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
