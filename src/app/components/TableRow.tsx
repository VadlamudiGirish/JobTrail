"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUS } from "@/generated/prisma";
import Button from "./Button";
import { useSWRConfig } from "swr";

type Application = {
  id: string;
  jobTitle: string;
  applicationStatus: STATUS;
  applicationDate: string;
};

export default function TableRow({
  application,
}: {
  application: Application;
}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const confirmed = confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      mutate("/api/applications"); // Revalidate data
    } catch (err) {
      console.error(err);
      alert("Failed to delete application.");
    }
  };

  return (
    <tr
      onClick={() => router.push(`/en/applications/${application.id}`)}
      className="cursor-pointer hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3 text-sm text-gray-800">
        {application.jobTitle}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {application.applicationStatus}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(application.applicationDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-right space-x-2">
        <Link href={`/en/applications/${application.id}/edit`}>
          <Button variant="primary" onClick={(e) => e.stopPropagation()}>
            Edit
          </Button>
        </Link>
        <Button variant="secondary" onClick={handleDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
