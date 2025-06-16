"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "@/app/components/PDFDocument";
import FilterSelect from "@/app/components/FilterSelect";
import UserProfileForm from "@/app/components/UserProfileForm";
import Button from "@/app/components/Button";
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
      .then((r) => r.json())
      .then((data) => {
        if (data.firstName) setProfile(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/applications/download?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setAvailableMonths(d.availableMonths || []));
  }, [locale]);

  useEffect(() => {
    if (!month) return;
    fetch(
      `/api/applications/download?month=${encodeURIComponent(
        month
      )}&locale=${locale}`
    )
      .then((r) => r.json())
      .then((apps: Application[]) => setApplications(apps));
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
        {month && applications.length > 0 && (
          <PDFDownloadLink
            document={
              <PDFDocument
                applications={applications}
                month={month}
                locale={locale}
                profile={profile}
              />
            }
            fileName={`Applications_${month}.pdf`}
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
