"use client";

import { useRouter, useParams } from "next/navigation";
import ApplicationForm from "@/app/components/ApplicationForm";
import { ApplicationFormData } from "@/app/components/ApplicationForm";
import { toUTCISOString } from "@/utils/date";

export default function NewApplicationPage() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };

  const handleCreate = async (data: ApplicationFormData) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        applicationDate: toUTCISOString(data.applicationDate),
        interviewDates: data.interviewDates?.map(toUTCISOString),
      }),
    });
    if (!res.ok) throw new Error("Failed to create application");

    router.push(`/${locale}/applications`);
  };

  return <ApplicationForm onSubmit={handleCreate} />;
}
