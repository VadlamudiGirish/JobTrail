"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = e.target.value;
    const newPath = pathname.replace(/^\/(en|de)/, `/${selectedLocale}`);
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={pathname.startsWith("/de") ? "de" : "en"}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
      disabled={isPending}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
