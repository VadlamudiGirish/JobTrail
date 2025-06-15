"use client";

import { useRouter } from "next/navigation";
import { Application } from "@/types/application";
import ActionButtons from "./ActionButtons";

export default function TableRow({
  application,
  locale,
}: {
  application: Application;
  locale: string;
}) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/en/applications/${application.id}`)}
      className="cursor-pointer hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3 text-sm text-gray-800 break-words">
        {application.jobTitle}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {application.applicationStatus}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {new Date(application.applicationDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 break-words">
        {application.location}
      </td>
      <td className="px-4 py-3 text-sm align-top w-[160px]">
        <ActionButtons id={application.id} locale={locale} />
      </td>
    </tr>
  );
}
