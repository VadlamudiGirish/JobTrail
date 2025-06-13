"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label?: string;
  options: Option[];
};

export default function FilterSelect({ name, label, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const value = searchParams.get(name) ?? "";

  return (
    <label className="text-sm flex items-center gap-1">
      {label && <span>{label}:</span>}
      <select
        className="border border-gray-300 rounded p-1"
        value={value}
        onChange={handleChange}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
