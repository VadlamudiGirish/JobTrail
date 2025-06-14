"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { PLATFORM, STATUS, Method } from "@/generated/prisma";
import Button from "@/app/components/Button";

const ApplicationFormSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  applicationDate: z.string().min(1, "Date is required"),
  applicationMethod: z.nativeEnum(Method),
  applicationStatus: z.nativeEnum(STATUS),
  contactPerson: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  platform: z.nativeEnum(PLATFORM),
  interviewRound: z.coerce.number().min(0),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

export default function ApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      applicationDate: new Date().toISOString().split("T")[0],
      interviewRound: 0,
    },
  });

  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (values: ApplicationFormData) => {
    try {
      const dateOnly = new Date(values.applicationDate);
      dateOnly.setHours(0, 0, 0, 0);

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          applicationDate: dateOnly.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create application");

      router.push(`/${locale}/applications`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md"
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        New Application
      </h1>

      {[
        { label: "Job Title", name: "jobTitle", type: "text" },
        { label: "Company Name", name: "companyName", type: "text" },
        { label: "Application Date", name: "applicationDate", type: "date" },
        { label: "Location", name: "location", type: "text" },
        {
          label: "Contact Person",
          name: "contactPerson",
          type: "text",
          optional: true,
        },
        { label: "Interview Round", name: "interviewRound", type: "number" },
      ].map(({ label, name, type, optional }) => (
        <div key={name}>
          <label className="block text-sm sm:text-base font-medium mb-1">
            {label}
          </label>
          <input
            {...register(name as keyof ApplicationFormData)}
            type={type}
            className="w-full px-4 py-3 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-orange-500"
          />
          {errors[name as keyof typeof errors] && !optional && (
            <p className="text-red-500 text-xs mt-1">
              {errors[name as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Application Method
        </label>
        <select
          {...register("applicationMethod")}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-md"
        >
          {Object.values(Method).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Application Status
        </label>
        <select
          {...register("applicationStatus")}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-md"
        >
          {Object.values(STATUS).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Platform
        </label>
        <select
          {...register("platform")}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-md"
        >
          {Object.values(PLATFORM).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm sm:text-base font-medium mb-1">
          Notes
        </label>
        <textarea
          {...register("notes")}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-md min-h-[100px]"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Save
        </Button>
      </div>
    </form>
  );
}
