import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { STATUS } from "@/generated/prisma";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status");
  const month = searchParams.get("month");
  const search = searchParams.get("search")?.toLowerCase() || "";

  const filters: Prisma.ApplicationWhereInput = {
    userId: user.id,
  };

  if (status && status !== "All") {
    filters.applicationStatus = status as STATUS;
  }

  if (month && month !== "All") {
    const [monthStr, yearStr] = month.split(" ");
    const date = new Date(`${monthStr} 1, ${yearStr}`);
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);

    filters.applicationDate = {
      gte: date,
      lt: nextMonth,
    };
  }

  if (search) {
    filters.OR = [
      {
        jobTitle: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where: filters }),
    prisma.application.findMany({
      where: filters,
      orderBy: { applicationDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const monthsRaw = await prisma.application.findMany({
    where: { userId: user.id },
    select: { applicationDate: true },
  });

  const availableMonths = Array.from(
    new Set(
      monthsRaw.map((a) =>
        new Date(a.applicationDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      )
    )
  );

  return NextResponse.json({ total, applications, availableMonths });
}

export async function POST(req: Request) {
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

  const body = await req.json();

  const newApp = await prisma.application.create({
    data: {
      ...body,
      userId: user.id,
    },
  });

  return NextResponse.json(newApp, { status: 201 });
}
