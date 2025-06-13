import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Button from "@/app/components/Button";
import FilterSelect from "@/app/components/FilterSelect";
import ApplicationRow from "@/app/components/ApplicationRow";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";

interface ApplicationsPageProps {
  params: { locale: string };
  searchParams: { status?: string; month?: string };
}

export default async function ApplicationsPage({
  params,
  searchParams,
}: ApplicationsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const where: Prisma.ApplicationWhereInput = { userId: session!.user.id };
  if (searchParams.status) {
    where.applicationStatus = searchParams.status;
  }
  if (searchParams.month) {
    const [yearStr, monthStr] = searchParams.month.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    if (!isNaN(year) && !isNaN(month)) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.applicationDate = { gte: start, lt: end };
    }
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { applicationDate: "desc" },
  });

  const currentYear = new Date().getFullYear();
  const monthsOptions = Array.from({ length: 12 }, (_, i) => {
    const label = new Date(currentYear, i).toLocaleString("default", { month: "long" });
    const value = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
    return { value, label };
  });

  const statusOptions = [
    { value: "APPLIED", label: "Applied" },
    { value: "INTERVIEW", label: "Interview" },
    { value: "OFFER", label: "Offer" },
    { value: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <FilterSelect name="status" label="Status" options={statusOptions} />
          <FilterSelect name="month" label="Month" options={monthsOptions} />
        </div>
        <Button href={`/${params.locale}/applications/new`}>New Application</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Application Date</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <ApplicationRow key={app.id} application={app} locale={params.locale} />
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
