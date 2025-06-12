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
      className="bg-white text-black rounded p-1 text-sm"
      disabled={isPending}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
