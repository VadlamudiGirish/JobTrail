"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Application } from "@/types/application";
import Button from "./Button";

export default function TableRow({
  application,
  onDelete,
}: {
  application: Application;
  onDelete: (id: string) => void;
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
      <td className="px-4 py-3 text-sm text-right">
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Link href={`/en/applications/${application.id}/edit`}>
            <Button
              variant="primary"
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-auto"
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(application.id);
            }}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
