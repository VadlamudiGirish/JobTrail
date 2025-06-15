import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Button from "@/app/components/Button";
import ActionButtons from "@/app/components/ActionButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Details",
};

type Params = Promise<{
  id: string;
  locale: string;
}>;

export default async function ApplicationDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id, locale } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 pb-20">
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

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link href={`/${locale}/applications`}>
            <Button variant="secondary">← Back</Button>
          </Link>
          <ActionButtons id={id} locale={locale} />
        </div>
      </div>
    </div>
  );
}
