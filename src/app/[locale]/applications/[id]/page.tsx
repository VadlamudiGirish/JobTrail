import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Button from "@/app/components/Button";
import Link from "next/link";
import ActionButtons from "@/app/components/ActionButtons";

type Props = {
  params: { locale: string; id: string };
};

export default async function ApplicationDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/${params.locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });

  if (!user || !application || application.userId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Application Details</h1>

        <div>
          <strong>Job Title:</strong> {application.jobTitle}
        </div>
        <div>
          <strong>Company Name:</strong> {application.companyName}
        </div>
        <div>
          <strong>Application Date:</strong>{" "}
          {new Date(application.applicationDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Location:</strong> {application.location}
        </div>
        <div>
          <strong>Status:</strong> {application.applicationStatus}
        </div>
        <div>
          <strong>Platform:</strong> {application.platform}
        </div>
        <div>
          <strong>Method:</strong> {application.applicationMethod}
        </div>
        <div>
          <strong>Contact Person:</strong> {application.contactPerson || "—"}
        </div>
        <div>
          <strong>Interview Round:</strong> {application.interviewRound}
        </div>
        <div>
          <strong>Notes:</strong> {application.notes || "—"}
        </div>

        <div className="flex gap-4 pt-6">
          <Link href={`/${params.locale}/applications`}>
            <Button variant="secondary">← Back</Button>
          </Link>

          <ActionButtons id={params.id} locale={params.locale} />
        </div>
      </div>
    </div>
  );
}
