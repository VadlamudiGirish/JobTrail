"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STATUS } from "@/generated/prisma";
import { Application } from "@/types/application";
import useSWR from "swr";
import FilterSelect from "@/app/components/FilterSelect";
import Button from "@/app/components/Button";
import ApplicationsTable from "@/app/components/ApplicationsTable";
import Pagination from "@/app/components/Pagination";

const PAGE_SIZE = 10;

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = pathname.split("/")[1];

  const page = parseInt(searchParams.get("page") || "1");
  const statusFilter = searchParams.get("status") || "";
  const monthFilter = searchParams.get("month") || "";

  const setQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, error, isLoading } = useSWR(
    session?.user
      ? `/api/applications?page=${page}&status=${statusFilter}&month=${monthFilter}`
      : null
  );

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

  const applications: Application[] = data?.applications || [];
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <div className="space-y-6 px-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 bg-white shadow-sm rounded-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(val) => setQuery("status", val)}
            options={["All", ...Object.values(STATUS)]}
          />
          <FilterSelect
            label="Month"
            value={monthFilter}
            onChange={(val) => setQuery("month", val)}
            options={["All", ...(data?.availableMonths || [])]}
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
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-500">No applications found.</div>
      ) : (
        <>
          <ApplicationsTable applications={applications} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => goToPage(page - 1)}
            onNext={() => goToPage(page + 1)}
          />
        </>
      )}
    </div>
  );
}
