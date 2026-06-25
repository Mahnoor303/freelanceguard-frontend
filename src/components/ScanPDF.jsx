import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#0B1510',
    color: '#E2E8F0',
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1px solid #2C501C',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#61FF8B',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#61FF8B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  value: {
    fontSize: 12,
    fontWeight: 700,
  },
  section: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#61FF8B',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 8,
  },
  flag: { color: '#FF4D4D' },
  safe: { color: '#61FF8B' },
  summary: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#E2E8F0',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#A0A0A0',
    borderTop: '1px solid #2C501C',
    paddingTop: 8,
  },
});

export default function ScanPDF({ scan, children }) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>🛡️ FreelanceGuard</Text>
          <Text style={styles.label}>{new Date().toLocaleDateString()}</Text>
        </View>
        <Text style={styles.title}>Scan Report</Text>
        <Text style={styles.subtitle}>AI‑Powered Scam Detection</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Scan Type:</Text>
          <Text style={styles.value}>{scan.scanType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Risk Score:</Text>
          <Text style={styles.value}>{scan.riskScore}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Risk Level:</Text>
          <Text style={[styles.value, { color: scan.riskLevel === 'danger' ? '#FF4D4D' : scan.riskLevel === 'caution' ? '#F59E0B' : '#61FF8B' }]}>
            {scan.riskLevel.toUpperCase()}
          </Text>
        </View>

        {scan.redFlags?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Red Flags</Text>
            {scan.redFlags.map((flag, i) => (
              <Text key={i} style={[styles.listItem, styles.flag]}>• {flag}</Text>
            ))}
          </View>
        )}

        {scan.safeSigns?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safe Signs</Text>
            {scan.safeSigns.map((sign, i) => (
              <Text key={i} style={[styles.listItem, styles.safe]}>• {sign}</Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Summary</Text>
          <Text style={styles.summary}>{scan.aiSummary}</Text>
        </View>

        <Text style={styles.footer}>FreelanceGuard – Protect Your Work. Guard Your Income. | Generated on {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink document={doc} fileName={`FreelanceGuard_${scan.scanType}_${Date.now()}.pdf`}>
      {({ loading }) =>
        children ? (
          children
        ) : loading ? (
          'Generating PDF...'
        ) : (
          'Download PDF'
        )
      }
    </PDFDownloadLink>
  );
}