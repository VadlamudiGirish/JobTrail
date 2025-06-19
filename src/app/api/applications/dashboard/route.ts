import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface DashboardPayload {
  totals: {
    applied: number;
    interviewed: number;
    rejected: number;
  };
  byMonth: { month: string; count: number }[];
  recent: { id: string; jobTitle: string; status: string }[];
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const all = await prisma.application.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      applicationDate: true,
      applicationStatus: true,
      jobTitle: true,
    },
    orderBy: { applicationDate: "desc" },
  });

  const totals = {
    applied: 0,
    interviewed: 0,
    rejected: 0,
  };
  all.forEach((a) => {
    switch (a.applicationStatus) {
      case "APPLIED":
        totals.applied++;
        break;
      case "INTERVIEWED":
        totals.interviewed++;
        break;
      case "REJECTED":
        totals.rejected++;
        break;
    }
  });

  const byMonthMap = new Map<string, number>();
  all.forEach((a) => {
    const dt = new Date(a.applicationDate);
    const key = dt.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    byMonthMap.set(key, (byMonthMap.get(key) || 0) + 1);
  });
  const byMonth = Array.from(byMonthMap.entries())
    .sort(
      ([a], [b]) => new Date(a + " 1").getTime() - new Date(b + " 1").getTime()
    )
    .map(([month, count]) => ({ month, count }));

  const recent = all.slice(0, 15).map((a) => ({
    id: a.id,
    jobTitle: a.jobTitle,
    status: a.applicationStatus,
  }));

  const payload: DashboardPayload = { totals, byMonth, recent };
  return NextResponse.json(payload);
}
