"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PLATFORM, STATUS, Method } from "@/generated/prisma";
import Button from "@/app/components/Button";
import { toUTCDate } from "@/utils/date";

const ApplicationFormSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  applicationDate: z.string().min(1),
  location: z.string().min(1),
  applicationMethod: z.nativeEnum(Method),
  applicationStatus: z.nativeEnum(STATUS),
  platform: z.nativeEnum(PLATFORM),
  interviewRound: z.coerce
    .number()
    .min(0, "Interview round cannot be negative"),
  contactPerson: z.string().optional(),
  notes: z.string().optional(),
  jobLink: z.string().url().optional(),
  jobDescription: z.string().optional(),
  interviewDates: z.array(z.string().min(1, "Date required")).optional(),
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

type Props = {
  initialData?: Partial<ApplicationFormData>;
  onSubmit: (values: ApplicationFormData) => Promise<void>;
};

export default function ApplicationForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      applicationDate: new Date().toISOString().split("T")[0],
      interviewRound: 0,
      interviewDates: [],
      ...initialData,
    },
  });

  const [error, setError] = useState("");
  const interviewRound = watch("interviewRound");

  // Keep the interviewDates array length in sync with interviewRound
  useEffect(() => {
    const current = watch("interviewDates") || [];
    const expanded = Array.from(
      { length: interviewRound },
      (_, i) => current[i] || ""
    );
    setValue("interviewDates", expanded);
  }, [interviewRound, setValue, watch]);

  // On mount or when initialData changes, set all date inputs via UTC
  useEffect(() => {
    if (initialData?.applicationDate) {
      const formatted = toUTCDate(initialData.applicationDate)
        .toISOString()
        .split("T")[0];
      setValue("applicationDate", formatted);
    }
    if (
      initialData?.interviewDates &&
      Array.isArray(initialData.interviewDates)
    ) {
      const formattedDates = initialData.interviewDates.map(
        (d) => toUTCDate(d).toISOString().split("T")[0]
      );
      setValue("interviewDates", formattedDates);
    }
  }, [initialData, setValue]);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch (err: unknown) {
          setError(
            err instanceof Error ? err.message : "Unknown error occurred"
          );
        }
      })}
      className="space-y-6 w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md"
    >
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        {initialData ? "Edit Application" : "New Application"}
      </h1>

      {/* Basic text/date/number inputs */}
      {[
        { name: "jobTitle", label: "Job Title", type: "text" },
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
        },
        {
          name: "applicationDate",
          label: "Application Date",
          type: "date",
        },
        { name: "location", label: "Location", type: "text" },
        {
          name: "contactPerson",
          label: "Contact Person",
          type: "text",
          optional: true,
        },
        {
          name: "jobLink",
          label: "Job Link",
          type: "url",
          optional: true,
        },
        {
          name: "interviewRound",
          label: "Interview Round",
          type: "number",
        },
      ].map(({ name, label, type, optional }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          <input
            type={type}
            {...register(name as keyof ApplicationFormData)}
            className="w-full px-4 py-3 border rounded-md"
          />
          {errors[name as keyof typeof errors] && !optional && (
            <p className="text-red-500 text-xs mt-1">
              {errors[name as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>
      ))}

      {/* Dynamic interview date fields */}
      {interviewRound > 0 && (
        <div className="space-y-2">
          {Array.from({ length: interviewRound }).map((_, i) => (
            <Fragment key={i}>
              <label className="block text-sm font-medium mb-1">
                Interview {i + 1} Date
              </label>
              <input
                type="date"
                {...register(`interviewDates.${i}`)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </Fragment>
          ))}
        </div>
      )}

      {/* Select dropdowns */}
      {[
        {
          name: "applicationMethod",
          options: Method,
        },
        {
          name: "applicationStatus",
          options: STATUS,
        },
        { name: "platform", options: PLATFORM },
      ].map(({ name, options }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {name}
          </label>
          <select
            {...register(name as keyof ApplicationFormData)}
            className="w-full px-4 py-3 border rounded-md"
          >
            {Object.values(options).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Markdown‐friendly textareas */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Job Description (Markdown supported)
        </label>
        <textarea
          {...register("jobDescription")}
          className="w-full px-4 py-3 border rounded-md min-h-[100px] font-mono"
          placeholder="Job Description…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Notes (Markdown supported)
        </label>
        <textarea
          {...register("notes")}
          className="w-full px-4 py-3 border rounded-md min-h-[100px] font-mono"
          placeholder="E.g. _waiting for feedback_, **technical round** done…"
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
