"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Application } from "@/types/application";

Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/v6/Helvetica.woff2" }],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: { fontSize: 12, marginBottom: 12 },
  userInfo: { marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  tableRow: { flexDirection: "row", marginBottom: 2 },
  cell: { flex: 1, padding: 2 },
  headerCell: { flex: 1, padding: 2, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 20,
    fontSize: 8,
    textAlign: "center",
    width: "100%",
  },
});

interface Props {
  applications: Application[];
  month: string;
  locale: string;
  profile: {
    firstName: string;
    lastName: string;
    customerNumber: string;
  };
}

export function PDFDocument({ applications, month, locale, profile }: Props) {
  const ROWS_PER_PAGE = 25;
  const pages = [];
  for (let i = 0; i < applications.length; i += ROWS_PER_PAGE) {
    pages.push(applications.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((chunk, idx) => (
        <Page key={idx} style={styles.page} size="A4">
          <Text style={styles.header}>Application Record - {month}</Text>

          <View style={styles.userInfo}>
            <Text>Customer No: {profile.customerNumber}</Text>
            <Text>
              Name: {profile.firstName} {profile.lastName}
            </Text>
          </View>

          <View style={styles.tableHeader}>
            {["Date", "Company", "Position", "Method", "Status", "Notes"].map(
              (label) => (
                <Text key={label} style={styles.headerCell}>
                  {label}
                </Text>
              )
            )}
          </View>

          {chunk.map((app, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>
                {new Date(app.applicationDate).toLocaleDateString(locale)}
              </Text>
              <Text style={styles.cell}>{app.companyName}</Text>
              <Text style={styles.cell}>{app.jobTitle}</Text>
              <Text style={styles.cell}>{app.applicationMethod}</Text>
              <Text style={styles.cell}>{app.applicationStatus}</Text>
              <Text style={styles.cell}>{app.notes || ""}</Text>
            </View>
          ))}

          <Text style={styles.footer}>
            Page {idx + 1} of {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}
