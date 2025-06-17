"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { useSWRConfig } from "swr";
import { Application } from "@/types/application";

interface ActionButtonsProps {
  id: string;
  locale: string;
}

interface CacheData {
  total: number;
  applications: Application[];
  availableMonths?: string[];
}

export default function ActionButtons({ id, locale }: ActionButtonsProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error } = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      alert(error ?? "Failed to delete");
      return;
    }

    await mutate<CacheData>(
      (key) => typeof key === "string" && key.startsWith("/api/applications?"),
      (cached) => {
        // if we didn’t have a list cache yet, bail
        if (!cached || !Array.isArray(cached.applications)) {
          return cached;
        }
        return {
          ...cached,
          total: Math.max(0, cached.total - 1),
          applications: cached.applications.filter((app) => app.id !== id),
        };
      },
      false
    );

    router.push(`/${locale}/applications`);
  };

  return (
    <div className="flex gap-2 justify-end">
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
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="w-full sm:w-auto"
      >
        Delete
      </Button>
    </div>
  );
}
