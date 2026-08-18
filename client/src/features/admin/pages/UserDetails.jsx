import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminApi.getUserById(id);
      if (response.success) {
        setUserData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!userData || !userData.profile) return;
    
    // Prevent admin from disabling themselves via UI logic
    if (userData.profile.role === 'admin') {
      alert('Cannot modify the status of an administrator.');
      return;
    }

    const currentStatus = userData.profile.isActive;
    const newStatus = !currentStatus;
    
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'enable' : 'disable'} this student account?`)) return;

    try {
      setStatusUpdating(true);
      const response = await adminApi.updateUserStatus(id, newStatus);
      if (response.success) {
        setUserData({
          ...userData,
          profile: response.data
        });
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading user details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!userData || !userData.profile) return <div className="p-8 text-center">User not found</div>;

  const { profile, applications, reviews } = userData;

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="text-blue-600 hover:underline flex items-center gap-1">
            &larr; Back to Users
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>
        
        {profile.role !== 'admin' && (
          <button
            onClick={handleToggleStatus}
            disabled={statusUpdating}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              profile.isActive 
                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
            } disabled:opacity-50`}
          >
            {statusUpdating ? 'Updating...' : profile.isActive ? 'Disable Student Account' : 'Re-enable Student Account'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Basic Profile Info */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <div className="mt-3 flex gap-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {profile.role}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${profile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {profile.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase">Joined</span>
              <span className="text-sm text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase">Target Course</span>
              <span className="text-sm text-gray-900">{profile.course || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase">Target Degree</span>
              <span className="text-sm text-gray-900">{profile.degree || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase">Target Country</span>
              <span className="text-sm text-gray-900">{profile.countryPreference || 'Not specified'}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase">CGPA</span>
                <span className="text-sm text-gray-900">{profile.cgpa || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase">Budget</span>
                <span className="text-sm text-gray-900">{profile.budget ? `$${profile.budget}` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Relational Data Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Applications ({applications.length})</h3>
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase">
                      <th className="py-2 pr-4 font-medium">University</th>
                      <th className="py-2 pr-4 font-medium">Course</th>
                      <th className="py-2 pr-4 font-medium">Term</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium text-gray-900">{app.university?.name || 'Unknown'}</td>
                        <td className="py-3 pr-4 text-gray-600">{app.course}</td>
                        <td className="py-3 pr-4 text-gray-600">{app.term}</td>
                        <td className="py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No applications found.</p>
            )}
          </div>

          {/* Wishlist */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Wishlist ({profile.wishlist.length})</h3>
            {profile.wishlist.length > 0 ? (
              <ul className="space-y-2">
                {profile.wishlist.map(w => (
                  <li key={w._id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg text-sm">
                    <span className="font-medium text-gray-800">{w.university?.name || 'Unknown University'}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      w.priority === 'High' ? 'bg-red-100 text-red-700' :
                      w.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{w.priority}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Wishlist is empty.</p>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-gray-900">{rev.university?.name || 'Unknown'}</span>
                      <span className="text-yellow-500 font-bold text-sm">★ {rev.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{rev.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No reviews written.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetails;
