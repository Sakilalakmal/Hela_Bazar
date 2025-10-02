import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getVendorApplications, 
  getAllVendors, 
  approveVendor, 
  rejectVendor, 
  updateUserStatus 
} from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminVendors = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [existingVendors, setExistingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [processingId, setProcessingId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [applicationsRes, vendorsRes] = await Promise.all([
        getVendorApplications(token),
        getAllVendors(token)
      ]);

      setApplications(applicationsRes.applications || []);
      setExistingVendors(vendorsRes.allVendors || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (applicationId) => {
    try {
      setProcessingId(applicationId);
      
      await approveVendor(applicationId, token);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: 'approved' }
            : app
        )
      );
      
      toast.success('Vendor application approved successfully!');
      
      // Refresh data to get updated vendor list
      setTimeout(() => {
        fetchData();
      }, 1000);
      
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error('Failed to approve vendor application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectVendor = async (applicationId) => {
    try {
      setProcessingId(applicationId);
      
      await rejectVendor(applicationId, token);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        )
      );
      
      toast.success('Vendor application rejected');
      
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast.error('Failed to reject vendor application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleVendorStatusUpdate = async (vendorId, newStatus) => {
    try {
      setProcessingId(vendorId);
      
      await updateUserStatus(vendorId, newStatus, token);
      
      // Update local state
      setExistingVendors(prev => 
        prev.map(vendor => 
          vendor._id === vendorId 
            ? { ...vendor, active: newStatus }
            : vendor
        )
      );
      
      toast.success(`Vendor status updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast.error('Failed to update vendor status');
    } finally {
      setProcessingId(null);
    }
  };

  const openApplicationModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setShowModal(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter existing vendors
  const filteredVendors = existingVendors.filter(vendor => {
    const matchesSearch = vendor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vendor.active === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
      banned: 'bg-red-100 text-red-800 border-red-300'
    };

    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Vendor Management Center</h1>
        <p className="text-blue-100">Manage vendor applications and existing vendor accounts</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-blue-900">{applications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
              📋
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-blue-900">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Vendors</p>
              <p className="text-3xl font-bold text-blue-900">
                {existingVendors.filter(vendor => vendor.active === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🏪
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Rejected/Banned</p>
              <p className="text-3xl font-bold text-blue-900">
                {applications.filter(app => app.status === 'rejected').length + 
                 existingVendors.filter(vendor => vendor.active === 'banned').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🚫
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => {
              setActiveTab('applications');
              setStatusFilter('all');
              setSearchTerm('');
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'applications'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            📋 Applications ({applications.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('vendors');
              setStatusFilter('all');
              setSearchTerm('');
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'vendors'
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            🏪 Active Vendors ({existingVendors.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'applications' ? 'applications' : 'vendors'} by name or email...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {activeTab === 'applications' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </>
              )}
            </select>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'applications' ? (
        /* Vendor Applications */
        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center text-blue-400">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No Applications Found</h3>
              <p>No vendor applications match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredApplications.map((application) => (
                <div 
                  key={application._id} 
                  className="bg-blue-50 rounded-lg border border-blue-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  {/* Application Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {application.businessName?.charAt(0).toUpperCase() || 'B'}
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 text-lg">
                          {application.businessName || 'Unknown Business'}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {application.contactPerson?.name || 'Unknown Owner'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(application.status)}`}>
                      {application.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-500">📧</span>
                      <span className="text-blue-700">{application.contactPerson?.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-500">📱</span>
                      <span className="text-blue-700">{application.contactPerson?.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-500">🏢</span>
                      <span className="text-blue-700">{application.category || 'Unknown category'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-blue-500">📅</span>
                      <span className="text-blue-700">
                        {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openApplicationModal(application)}
                      className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      👁️ View Full Details
                    </button>
                    
                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveVendor(application._id)}
                          disabled={processingId === application._id}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === application._id ? '⏳' : '✅'} Approve
                        </button>
                        <button
                          onClick={() => handleRejectVendor(application._id)}
                          disabled={processingId === application._id}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === application._id ? '⏳' : '❌'} Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Existing Vendors Table - Same as before */
        <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Vendor Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-blue-400">
                      <div className="text-6xl mb-4">🏪</div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">No Vendors Found</h3>
                      <p>No vendors match your current filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-semibold text-lg">
                              {vendor.username?.charAt(0).toUpperCase() || 'V'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-blue-900">
                              {vendor.username || 'Unknown Vendor'}
                            </div>
                            <div className="text-sm text-blue-500">
                              ID: {vendor._id?.slice(-8) || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-700">{vendor.email || 'No email'}</div>
                        <div className="text-sm text-blue-500">{vendor.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(vendor.active)}`}>
                          {vendor.active?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {vendor.active !== 'active' && (
                            <button
                              onClick={() => handleVendorStatusUpdate(vendor._id, 'active')}
                              disabled={processingId === vendor._id}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              {processingId === vendor._id ? '⏳' : '✅'} Activate
                            </button>
                          )}
                          {vendor.active !== 'inactive' && vendor.active !== 'banned' && (
                            <button
                              onClick={() => handleVendorStatusUpdate(vendor._id, 'inactive')}
                              disabled={processingId === vendor._id}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 transition-colors disabled:opacity-50"
                            >
                              {processingId === vendor._id ? '⏳' : '⏸️'} Deactivate
                            </button>
                          )}
                          {vendor.active !== 'banned' && (
                            <button
                              onClick={() => handleVendorStatusUpdate(vendor._id, 'banned')}
                              disabled={processingId === vendor._id}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {processingId === vendor._id ? '⏳' : '🚫'} Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comprehensive Application Detail Modal with Blurred Background */}
{showModal && selectedApplication && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Blurred Background */}
    <div 
      className="absolute inset-0 bg-white/20 backdrop-blur-sm"
      onClick={closeModal}
    ></div>
    
    {/* Modal Content */}
    <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden z-10 flex flex-col">
      {/* Modal Header - Fixed */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Vendor Application Details</h2>
            <p className="text-blue-100 mt-1">Complete application information</p>
          </div>
          <button
            onClick={closeModal}
            className="text-white hover:text-blue-200 text-3xl font-bold bg-blue-800/50 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Modal Body - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          
          {/* Business Information */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              🏢 Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Business Name</label>
                <p className="text-blue-900 font-semibold text-lg">{selectedApplication.businessName || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Category</label>
                <p className="text-blue-900">{selectedApplication.category || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Store Type</label>
                <p className="text-blue-900">{selectedApplication.storeType || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Registration Number</label>
                <p className="text-blue-900">{selectedApplication.businessRegistrationNumber || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Tax ID</label>
                <p className="text-blue-900">{selectedApplication.taxId || 'Not provided'}</p>
              </div>
            </div>
            
            {/* Business Description */}
            {selectedApplication.businessDescription && (
              <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100">
                <label className="text-sm font-semibold text-blue-700 block mb-2">Business Description</label>
                <p className="text-blue-900 leading-relaxed">{selectedApplication.businessDescription}</p>
              </div>
            )}
          </div>

          {/* Contact Person Information */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
              👤 Contact Person
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <label className="text-sm font-semibold text-green-700 block mb-2">Name</label>
                <p className="text-green-900 font-semibold text-lg">{selectedApplication.contactPerson?.name || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <label className="text-sm font-semibold text-green-700 block mb-2">Position</label>
                <p className="text-green-900">{selectedApplication.contactPerson?.position || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <label className="text-sm font-semibold text-green-700 block mb-2">Email</label>
                <p className="text-green-900">{selectedApplication.contactPerson?.email || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <label className="text-sm font-semibold text-green-700 block mb-2">Phone</label>
                <p className="text-green-900">{selectedApplication.contactPerson?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
              📍 Business Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-700 block mb-2">Street</label>
                <p className="text-yellow-900">{selectedApplication.businessAddress?.street || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-700 block mb-2">City</label>
                <p className="text-yellow-900">{selectedApplication.businessAddress?.city || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-700 block mb-2">State</label>
                <p className="text-yellow-900">{selectedApplication.businessAddress?.state || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-700 block mb-2">Zip Code</label>
                <p className="text-yellow-900">{selectedApplication.businessAddress?.zipCode || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-100">
                <label className="text-sm font-semibold text-yellow-700 block mb-2">Country</label>
                <p className="text-yellow-900">{selectedApplication.businessAddress?.country || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-3">
              💳 Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="text-sm font-semibold text-purple-700 block mb-2">Bank Name</label>
                <p className="text-purple-900">{selectedApplication.paymentDetails?.bankName || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="text-sm font-semibold text-purple-700 block mb-2">Account Number</label>
                <p className="text-purple-900">{selectedApplication.paymentDetails?.accountNumber || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="text-sm font-semibold text-purple-700 block mb-2">Routing Number</label>
                <p className="text-purple-900">{selectedApplication.paymentDetails?.routingNumber || 'Not provided'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="text-sm font-semibold text-purple-700 block mb-2">Payment Method</label>
                <p className="text-purple-900 capitalize">{selectedApplication.paymentDetails?.paymentMethod || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {selectedApplication.certifications && selectedApplication.certifications.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
                🏆 Certifications
              </h3>
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.certifications.map((cert, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Media Links */}
          {selectedApplication.socialMediaLinks && selectedApplication.socialMediaLinks.length > 0 && (
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
              <h3 className="text-2xl font-bold text-pink-900 mb-6 flex items-center gap-3">
                📱 Social Media
              </h3>
              <div className="bg-white p-4 rounded-lg border border-pink-100">
                <div className="space-y-2">
                  {selectedApplication.socialMediaLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-pink-700 hover:text-pink-900 underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shipping Methods */}
          {selectedApplication.preferredShippingMethods && selectedApplication.preferredShippingMethods.length > 0 && (
            <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
              <h3 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                🚚 Shipping Methods
              </h3>
              <div className="bg-white p-4 rounded-lg border border-teal-100">
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.preferredShippingMethods.map((method, index) => (
                    <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Initial Product List */}
          {selectedApplication.initialProductList && selectedApplication.initialProductList.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3">
                📦 Initial Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedApplication.initialProductList.map((product, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-orange-900 mb-2">{product.title}</h4>
                    <p className="text-orange-700 text-sm">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shop Images */}
          {selectedApplication.shopImages && selectedApplication.shopImages.length > 0 && (
            <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
              <h3 className="text-2xl font-bold text-rose-900 mb-6 flex items-center gap-3">
                🖼️ Shop Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedApplication.shopImages.map((image, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg border border-rose-100">
                    <img 
                      src={image} 
                      alt={`Shop image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Status & Metadata */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              📊 Application Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Current Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadge(selectedApplication.status)}`}>
                  {selectedApplication.status?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Application Date</label>
                <p className="text-gray-900">
                  {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <label className="text-sm font-semibold text-gray-700 block mb-2">User ID</label>
                <p className="text-gray-900 font-mono text-sm">{selectedApplication.userId || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Extra padding at bottom to ensure footer doesn't overlap */}
          <div className="pb-6"></div>

        </div>
      </div>

      {/* Modal Footer - Fixed at bottom */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {selectedApplication.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  handleApproveVendor(selectedApplication._id);
                  closeModal();
                }}
                disabled={processingId === selectedApplication._id}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingId === selectedApplication._id ? '⏳ Processing...' : '✅ Approve Application'}
              </button>
              <button
                onClick={() => {
                  handleRejectVendor(selectedApplication._id);
                  closeModal();
                }}
                disabled={processingId === selectedApplication._id}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingId === selectedApplication._id ? '⏳ Processing...' : '❌ Reject Application'}
              </button>
            </>
          )}
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminVendors;