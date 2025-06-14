"use client";

import TableRow from "./TableRow";
import { Application } from "@/types/application";

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Job Title
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Application Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Application Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Location
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
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
