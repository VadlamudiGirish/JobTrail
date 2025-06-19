import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardPayload } from "@/types/dashboardPayload";

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

  const totals = { applied: 0, interviewed: 0, rejected: 0 };
  for (const a of all) {
    if (a.applicationStatus === "APPLIED") totals.applied++;
    else if (a.applicationStatus === "INTERVIEWED") totals.interviewed++;
    else if (a.applicationStatus === "REJECTED") totals.rejected++;
  }

  const byMonthMap = new Map<string, number>();
  for (const a of all) {
    const dt = new Date(a.applicationDate);
    const key = dt.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    byMonthMap.set(key, (byMonthMap.get(key) || 0) + 1);
  }
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

  let byLocation: { location: string; count: number }[] = [];
  try {
    const locationGroups = await prisma.application.groupBy({
      by: ["location"],
      _count: { location: true },
      where: { userId: user.id },
      orderBy: { _count: { location: "desc" } },
    });
    byLocation = locationGroups.map((g) => ({
      location: g.location ?? "Unknown",
      count: g._count.location,
    }));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error while grouping applications by Month", e.message);
    } else {
      console.error("Unknown error while grouping applications by Month");
    }
    byLocation = [];
  }

  const payload: DashboardPayload = {
    totals,
    byMonth,
    recent,
    byLocation,
  };
  return NextResponse.json(payload);
}
