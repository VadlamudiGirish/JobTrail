import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Application } from "@/types/application";
import { UserProfile } from "@/types/user";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3H6qxji7Ik9pAAAb.woff2" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: "Helvetica" },
  header: { fontSize: 14, marginBottom: 10 },
  profile: { marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 4,
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
  profile: UserProfile;
}

const ROWS_PER_PAGE = 25;

export function PDFDocument({ applications, month, locale, profile }: Props) {
  const pages: Application[][] = [];
  for (let i = 0; i < applications.length; i += ROWS_PER_PAGE) {
    pages.push(applications.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((slice, pageIndex) => (
        <Page key={pageIndex} style={styles.page} size="A4">
          <Text style={styles.header}>Job Application Record — {month}</Text>
          <View style={styles.profile}>
            <Text>
              Name: {profile.firstName} {profile.lastName} | Customer No:{" "}
              {profile.customerNumber}
            </Text>
          </View>
          <View style={styles.tableHeader}>
            {["Date", "Company", "Job Title", "Method", "Status", "Notes"].map(
              (header) => (
                <Text key={header} style={styles.headerCell}>
                  {header}
                </Text>
              )
            )}
          </View>

          {slice.map((app, idx) => (
            <View key={idx} style={styles.tableRow}>
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
            Page {pageIndex + 1} of {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}
