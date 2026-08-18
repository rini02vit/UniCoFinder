import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
    color: '#374151',
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    width: '60%',
    fontSize: 12,
    color: '#111827',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    color: '#4b5563',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  }
});

const AdminAnalyticsReportPDF = ({ analytics }) => {
  const {
    registrationsOverTime,
    applicationsOverTime,
    applicationStatuses,
    scholarshipsByCoverage,
    popularUniversities,
    wishlistedUniversities
  } = analytics;

  // Aggregate totals
  const totalRegistrations = registrationsOverTime?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const totalApplications = applicationsOverTime?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>UniCoFinder System Analytics Report</Text>

        {/* Global Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Summary (Selected Range)</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total New Users:</Text>
            <Text style={styles.value}>{totalRegistrations}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total New Applications:</Text>
            <Text style={styles.value}>{totalApplications}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Report Generated On:</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Application Status Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Status Distribution</Text>
          {applicationStatuses && applicationStatuses.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCellHeader}>Status</Text></View>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCellHeader}>Count</Text></View>
              </View>
              {applicationStatuses.map((stat, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>{stat._id || 'Unknown'}</Text></View>
                  <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{stat.count}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No applications found.</Text>
          )}
        </View>

        {/* Most Applied Universities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 5 Most Applied-To Universities</Text>
          {popularUniversities && popularUniversities.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCellHeader}>University</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellHeader}>Applications</Text></View>
              </View>
              {popularUniversities.map((uni, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCell}>{uni.name || 'Unknown'}</Text></View>
                  <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{uni.count}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No applications found.</Text>
          )}
        </View>

        {/* Most Wishlisted Universities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 5 Most Wishlisted Universities</Text>
          {wishlistedUniversities && wishlistedUniversities.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCellHeader}>University</Text></View>
                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellHeader}>Saves</Text></View>
              </View>
              {wishlistedUniversities.map((uni, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCell}>{uni.name || 'Unknown'}</Text></View>
                  <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{uni.count}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No wishlist data found.</Text>
          )}
        </View>

        {/* Scholarships By Coverage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scholarships by Coverage Type</Text>
          {scholarshipsByCoverage && scholarshipsByCoverage.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCellHeader}>Coverage Type</Text></View>
                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCellHeader}>Count</Text></View>
              </View>
              {scholarshipsByCoverage.map((sch, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>{sch._id || 'Unknown'}</Text></View>
                  <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{sch.count}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No scholarship data found.</Text>
          )}
        </View>

      </Page>
    </Document>
  );
};

export default AdminAnalyticsReportPDF;
