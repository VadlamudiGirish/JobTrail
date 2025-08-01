import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Application } from "@/types/application";
import Button from "./Button";

interface Props {
  applications: Application[];
  month: string;
  profile: {
    firstName: string;
    lastName: string;
    customerNumber: string;
  };
}

export default function PDFDownloadButton({
  applications,
  month,
  profile,
}: Props) {
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(
      `Application Report - ${month === "All" ? "All Months" : month}`,
      14,
      20
    );

    doc.setFontSize(10);
    doc.text(`Customer Number: ${profile.customerNumber}`, 14, 30);
    doc.text(`Name: ${profile.firstName} ${profile.lastName}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [
        [
          "Application Date",
          "Company Name",
          "Position",
          "Method",
          "Status",
          "Notes",
        ],
      ],
      body: applications.map((app) => [
        new Date(app.applicationDate).toLocaleDateString(),
        app.companyName,
        app.jobTitle,
        app.applicationMethod,
        app.applicationStatus,
        app.notes ?? "",
      ]),
      styles: { fontSize: 9 },
    });

    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 10);
    }

    doc.save(`Applications_${month === "All" ? "All" : month}.pdf`);
    setLoading(false);
  };

  return (
    <Button onClick={generatePDF} variant="primary" disabled={loading}>
      {loading ? "Generating..." : "Download PDF"}
    </Button>
  );
}
