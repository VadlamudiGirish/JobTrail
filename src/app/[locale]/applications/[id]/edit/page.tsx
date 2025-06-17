"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import ApplicationForm from "@/app/components/ApplicationForm";
import { Application } from "@/types/application";
import { toUTCISOString } from "@/utils/date";

export default function EditApplicationPage() {
  const { id, locale } = useParams() as { id: string; locale: string };
  const router = useRouter();
  const { data, error, isLoading } = useSWR<Application>(
    `/api/applications/${id}`
  );

  if (isLoading) return <div className="p-4">Loading application...</div>;
  if (error || !data)
    return <div className="p-4 text-red-600">Failed to load application.</div>;

  const handleUpdate = async (values: Partial<Application>) => {
    const payload: Partial<Application> = { ...values };

    if (values.applicationDate) {
      payload.applicationDate = toUTCISOString(values.applicationDate);
    }
    if (values.interviewDates) {
      payload.interviewDates = values.interviewDates.map(toUTCISOString);
    }

    const response = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to update application");
    }

    await mutate(`/api/applications/${id}`);

    router.push(`/${locale}/applications/${id}`);
  };

  return <ApplicationForm initialData={data} onSubmit={handleUpdate} />;
}
