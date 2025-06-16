"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FilterSelect from "@/app/components/FilterSelect";
import UserProfileForm from "@/app/components/UserProfileForm";
import PDFDownloadButton from "@/app/components/PDFDownloadButton";
import { Application } from "@/types/application";

export default function DownloadPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    customerNumber: "",
  });

  const [month, setMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.firstName) setProfile(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/applications/download?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        const months = data.availableMonths || [];
        setAvailableMonths([
          "All",
          ...months.filter((m: string) => m !== "All"),
        ]);
      });
  }, [locale]);

  useEffect(() => {
    if (!month) {
      setApplications([]);
      return;
    }

    const url = `/api/applications/download?month=${encodeURIComponent(
      month
    )}&locale=${locale}`;

    fetch(url)
      .then((res) => res.json())
      .then((apps: Application[]) => {
        setApplications(apps);
      });
  }, [month, locale]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-center">
        Download Applications
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <UserProfileForm onSaved={setProfile} />
        <FilterSelect
          label="Month"
          value={month}
          options={["", ...availableMonths]}
          onChange={setMonth}
        />
      </div>

      <div className="text-center">
        {!month && <p className="text-gray-500">Please select a month.</p>}
        {month && applications.length === 0 && (
          <p className="text-gray-500">No applications in {month}.</p>
        )}
        {applications.length > 0 && (
          <PDFDownloadButton
            applications={applications}
            month={month}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}
