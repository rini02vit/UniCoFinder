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
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
    color: '#374151',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    width: '70%',
    fontSize: 12,
    color: '#111827',
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
    width: '33.3%',
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
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  }
});

const StudyAbroadReportPDF = ({ profile, applications, wishlist, scholarships }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>UniCoFinder Study Abroad Plan</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profile?.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Target Course:</Text>
            <Text style={styles.value}>{profile?.course || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CGPA:</Text>
            <Text style={styles.value}>{profile?.cgpa || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Budget:</Text>
            <Text style={styles.value}>{profile?.budget ? `$${profile.budget}` : 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Target Country:</Text>
            <Text style={styles.value}>{profile?.countryPreference || 'N/A'}</Text>
          </View>
        </View>

        {/* Applications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracked Applications</Text>
          {applications && applications.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>University</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Course</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Status</Text></View>
              </View>
              {applications.map((app, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{app.university?.name || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{app.course || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{app.status || 'N/A'}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No applications tracked yet.</Text>
          )}
        </View>

        {/* Wishlist Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Wishlist</Text>
          {wishlist && wishlist.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>University</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Priority</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Note</Text></View>
              </View>
              {wishlist.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.university?.name || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.priority || 'Medium'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.note || '-'}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No universities saved to wishlist.</Text>
          )}
        </View>

        {/* Scholarships Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Scholarships</Text>
          {scholarships && scholarships.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Name</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Amount</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Country</Text></View>
              </View>
              {scholarships.map((sch, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{sch.name || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{sch.amount ? `${sch.currency || '$'}${sch.amount}` : 'Varies'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{sch.country || 'N/A'}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No scholarships recommended based on your profile.</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default StudyAbroadReportPDF;
