"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { STATUS } from "@/generated/prisma";
import { Application } from "@/types/application";
import useSWR from "swr";
import FilterSelect from "@/app/components/FilterSelect";
import Button from "@/app/components/Button";
import ApplicationsTable from "@/app/components/ApplicationsTable";

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1];

  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const { data, error, isLoading } = useSWR(
    session?.user ? "/api/applications" : null
  );

  const applications = useMemo(() => data || [], [data]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app: Application) => {
      const matchesStatus =
        !statusFilter ||
        statusFilter === "All" ||
        app.applicationStatus === statusFilter;
      const matchesMonth =
        !monthFilter ||
        monthFilter === "All" ||
        new Date(app.applicationDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        }) === monthFilter;
      return matchesStatus && matchesMonth;
    });
  }, [applications, statusFilter, monthFilter]);

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Set<string>();
    applications.forEach((app: Application) => {
      const formatted = new Date(app.applicationDate).toLocaleString(
        "default",
        {
          month: "long",
          year: "numeric",
        }
      );
      uniqueMonths.add(formatted);
    });
    return Array.from(uniqueMonths);
  }, [applications]);

  if (status === "loading") {
    return <div className="p-4">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    router.push(`/${locale}/login`);
    return null;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load applications. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 bg-white shadow-sm rounded-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All", ...Object.values(STATUS)]}
          />
          <FilterSelect
            label="Month"
            value={monthFilter}
            onChange={setMonthFilter}
            options={["All", ...monthOptions]}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push(`/${locale}/applications/new`)}
          >
            + New Application
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center text-gray-500">No applications found.</div>
      ) : (
        <ApplicationsTable applications={filteredApplications} />
      )}
    </div>
  );
}
