import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
const ReportDownloader = React.lazy(() => import('../../reports/components/ReportDownloader'));

const AdminReports = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Using '10000d' as a hacky way to fetch all-time data or very long history if the backend uses days.
        // Or we can just use 365d. The backend parses range="365d"
        const response = await adminApi.getAnalytics('365d'); 
        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Reports</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">System Analytics Report (PDF)</h2>
        <p className="text-sm text-gray-600 mb-6">
          Download a comprehensive PDF summarizing the last 365 days of system activity, including registration volumes, application distributions, and university popularity.
        </p>

        {loading ? (
          <div className="text-gray-500">Compiling data...</div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">{error}</div>
        ) : analyticsData ? (
          <React.Suspense fallback={
            <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm opacity-70">
              Loading PDF Generator...
            </button>
          }>
            <ReportDownloader
              type="admin-analytics"
              data={{ analyticsData }}
              fileName={`UniCoFinder_System_Report_${new Date().toISOString().split('T')[0]}.pdf`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
              buttonText="Download System Report PDF"
              loadingText="Generating PDF..."
            />
          </React.Suspense>
        ) : null}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">User Directory Export (CSV)</h2>
        <p className="text-sm text-gray-600 mb-4">
          To export the complete User Directory as a CSV file, please navigate to the Manage Users page and use the Export feature.
        </p>
        <a href="/admin/users" className="text-blue-600 hover:underline font-medium">Go to Manage Users &rarr;</a>
      </div>
    </div>
  );
};

export default AdminReports;
