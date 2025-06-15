"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { mutate } from "swr";

export default function ActionButtons({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      mutate(`/api/applications?page="1"&status="All"&month="All"&search=""`);

      router.replace(`/${locale}/applications`);
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
      <Link
        href={`/${locale}/applications/${id}/edit`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="primary" className="w-full sm:w-auto">
          Edit
        </Button>
      </Link>
      <Button
        variant="secondary"
        onClick={handleDelete}
        className="w-full sm:w-auto"
      >
        Delete
      </Button>
    </div>
  );
}
