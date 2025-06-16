"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { usePathname } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { PDFDocument } from "@/app/components/PDFDocument";
import FilterSelect from "@/app/components/FilterSelect";
import UserProfileForm from "@/app/components/UserProfileForm";
import Button from "@/app/components/Button";
import { Application } from "@/types/application";
import { UserProfile } from "@/types/user";

// 🧠 Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DownloadPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [selectedMonth, setSelectedMonth] = useState("");
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    customerNumber: "",
  });

  // 🎯 Fetch list of available months
  const { data: monthData } = useSWR<{ availableMonths: string[] }>(
    `/api/applications/download?locale=${locale}`,
    fetcher
  );

  // 🎯 Fetch applications when month selected
  const { data: applications, isLoading } = useSWR<Application[]>(
    selectedMonth
      ? `/api/applications/download?month=${encodeURIComponent(
          selectedMonth
        )}&locale=${locale}`
      : null,
    fetcher
  );

  // 🎯 Fetch profile once
  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data: UserProfile) => {
        if (data.firstName) setProfile(data);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold text-center">
        Download Application Summary
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Profile form */}
        <UserProfileForm onSaved={setProfile} />

        {/* Month Selector */}
        <FilterSelect
          label="Month"
          value={selectedMonth}
          options={["", ...(monthData?.availableMonths || [])]}
          onChange={setSelectedMonth}
        />
      </div>

      {/* PDF Download Button */}
      <div className="text-center pt-4">
        {!selectedMonth && (
          <p className="text-gray-500">Please select a month.</p>
        )}

        {selectedMonth && isLoading && (
          <p className="text-gray-500">Loading applications...</p>
        )}

        {selectedMonth && applications?.length === 0 && (
          <p className="text-gray-500">
            No applications found for {selectedMonth}.
          </p>
        )}

        {selectedMonth && applications && applications.length > 0 && (
          <PDFDownloadLink
            document={
              <PDFDocument
                applications={applications}
                month={selectedMonth}
                locale={locale}
                profile={profile}
              />
            }
            fileName={`Applications_${selectedMonth}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button variant="primary" disabled>
                  Generating PDF...
                </Button>
              ) : (
                <Button variant="primary">Download PDF</Button>
              )
            }
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
}
