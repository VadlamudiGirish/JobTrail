import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const month = url.searchParams.get("month");
  const locale = url.searchParams.get("locale") || "en";

  if (month === null) {
    const raw = await prisma.application.findMany({
      where: { userId: session.user.id },
      select: { applicationDate: true },
    });

    const availableMonths = Array.from(
      new Set(
        raw.map((a) =>
          new Date(a.applicationDate).toLocaleString(locale, {
            month: "long",
            year: "numeric",
          })
        )
      )
    );

    return NextResponse.json({ availableMonths });
  }

  if (month === "All") {
    const allApps = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { applicationDate: "desc" },
    });

    const sanitized = allApps.map((app) => ({
      ...app,
      applicationDate: app.applicationDate.toISOString(),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      contactPerson: app.contactPerson ?? "",
      location: app.location ?? "",
      platform: app.platform ?? "Other",
      notes: app.notes ?? "",
    }));

    return NextResponse.json(sanitized);
  }

  const [monthName, yearStr] = month.split(" ");
  const from = new Date(`${monthName} 1, ${yearStr}`);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);

  const apps = await prisma.application.findMany({
    where: {
      userId: session.user.id,
      applicationDate: {
        gte: from,
        lt: to,
      },
    },
    orderBy: { applicationDate: "desc" },
  });

  const sanitized = apps.map((app) => ({
    ...app,
    applicationDate: app.applicationDate.toISOString(),
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    contactPerson: app.contactPerson ?? "",
    location: app.location ?? "",
    platform: app.platform ?? "Other",
    notes: app.notes ?? "",
  }));

  return NextResponse.json(sanitized);
}
