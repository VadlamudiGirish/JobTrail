"use client";

import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") || "";

  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="max-w-md mx-auto">
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Search Job title or Company..."
          defaultValue={search}
          onChange={(e) => updateSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
