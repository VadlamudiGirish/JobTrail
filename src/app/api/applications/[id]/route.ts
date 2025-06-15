import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.application.findUnique({
    where: { id: id },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
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
  const { id } = await context.params;
  const body = await req.json();

  const { applicationDate, ...rest } = body;

  const normalizedDate = new Date(applicationDate);
  normalizedDate.setHours(0, 0, 0, 0);

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...rest,
      applicationDate: normalizedDate.toISOString(),
    },
  });

  return NextResponse.json(updated);
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await prisma.application.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Unknown error while deleting " },
        { status: 500 }
      );
    }
  }
}
