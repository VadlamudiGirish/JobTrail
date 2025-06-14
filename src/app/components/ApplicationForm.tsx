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
      dateOnly.setHours(0, 0, 0, 0); // add time

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
      className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <div>
        <label className="block font-medium mb-1">Job Title</label>
        <input
          {...register("jobTitle")}
          className="w-full p-3 border rounded-md"
        />
        {errors.jobTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Company Name</label>
        <input
          {...register("companyName")}
          className="w-full p-3 border rounded-md"
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Application Date</label>
        <input
          {...register("applicationDate")}
          id="applicationDate"
          name="applicationDate"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 16)}
          className="w-full p-3 border rounded-md"
        />
        {errors.applicationDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.applicationDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Application Method</label>
        <select
          {...register("applicationMethod")}
          className="w-full p-3 border rounded-md"
        >
          {Object.values(Method).map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Application Status</label>
        <select
          {...register("applicationStatus")}
          className="w-full p-3 border rounded-md"
        >
          {Object.values(STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Location</label>
        <input
          {...register("location")}
          className="w-full p-3 border rounded-md"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Contact Person</label>
        <input
          {...register("contactPerson")}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Platform</label>
        <select
          {...register("platform")}
          className="w-full p-3 border rounded-md"
        >
          {Object.values(PLATFORM).map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Interview Round</label>
        <input
          type="number"
          {...register("interviewRound")}
          className="w-full p-3 border rounded-md"
        />
        {errors.interviewRound && (
          <p className="text-red-500 text-sm mt-1">
            {errors.interviewRound.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Notes</label>
        <textarea
          {...register("notes")}
          className="w-full p-3 border rounded-md"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
