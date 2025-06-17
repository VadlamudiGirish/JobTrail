import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Button from "@/app/components/Button";
import ActionButtons from "@/app/components/ActionButtons";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

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
          <strong>Contact Person:</strong> {application.contactPerson || "—"}
        </div>
        <div>
          <strong>Interview Round:</strong> {application.interviewRound}
        </div>

        {Array.isArray(application.interviewDates) &&
          application.interviewDates.length > 0 && (
            <div>
              <strong>Interview Dates:</strong>
              <ul className="list-disc list-inside mt-1">
                {application.interviewDates.map((date, index) => (
                  <li key={index}>{new Date(date).toLocaleDateString()}</li>
                ))}
              </ul>
            </div>
          )}

        <div>
          <strong>Application Method:</strong> {application.applicationMethod}
        </div>
        <div>
          <strong>Application Status:</strong> {application.applicationStatus}
        </div>
        <div>
          <strong>Platform:</strong> {application.platform}
        </div>

        {application.jobLink && (
          <div>
            <strong>Job Link:</strong>{" "}
            <a
              href={application.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
            >
              {application.jobLink}
            </a>
          </div>
        )}

        {application.jobDescription && (
          <div>
            <strong>Job Description:</strong>
            <div className="prose prose-sm mt-1 max-w-none">
              <ReactMarkdown>{application.jobDescription}</ReactMarkdown>
            </div>
          </div>
        )}

        <div>
          <strong>Notes:</strong>
          {application.notes ? (
            <div className="prose prose-sm mt-1 max-w-none">
              <ReactMarkdown>{application.notes}</ReactMarkdown>
            </div>
          ) : (
            " —"
          )}
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
