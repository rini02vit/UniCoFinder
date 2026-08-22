import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StudyAbroadReportPDF from './StudyAbroadReportPDF';
import AdminAnalyticsReportPDF from './AdminAnalyticsReportPDF';

const ReportDownloader = ({ type, data, fileName, className, style, buttonText, loadingText }) => {
  let document;
  
  if (type === 'study-abroad') {
    document = (
      <StudyAbroadReportPDF 
        profile={data.profileData} 
        applications={data.appData} 
        wishlist={data.wishlistData} 
        scholarships={data.schData?.items} 
      />
    );
  } else if (type === 'admin-analytics') {
    document = <AdminAnalyticsReportPDF analytics={data.analyticsData} />;
  }

  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className={className}
      style={style}
    >
      {({ loading }) => (loading ? (loadingText || 'Generating Report...') : (buttonText || 'Download Report 📄'))}
    </PDFDownloadLink>
  );
};

export default ReportDownloader;
