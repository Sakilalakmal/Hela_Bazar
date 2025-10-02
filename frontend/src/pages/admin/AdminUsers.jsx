import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllConsumers, getAllVendors, updateUserStatus } from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { token } = useAuth();
  const [consumers, setConsumers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consumers');
  const [updatingUser, setUpdatingUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      const [consumersRes, vendorsRes] = await Promise.all([
        getAllConsumers(token),
        getAllVendors(token)
      ]);

      setConsumers(consumersRes.allUsers || []);
      setVendors(vendorsRes.allVendors || []);
      
    //   toast.success('Users loaded successfully');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      setUpdatingUser(userId);
      
      await updateUserStatus(userId, newStatus, token);
      
      // Update local state
      const updateUserInList = (userList) => 
        userList.map(user => 
          user._id === userId ? { ...user, active: newStatus } : user
        );

      setConsumers(prev => updateUserInList(prev));
      setVendors(prev => updateUserInList(prev));
      
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Get current users based on active tab
  const getCurrentUsers = () => {
    const allUsers = activeTab === 'consumers' ? consumers : vendors;
    
    // Apply search filter
    let filteredUsers = allUsers.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.active === statusFilter);
    }

    return filteredUsers;
  };

  // Pagination logic
  const currentUsers = getCurrentUsers();
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = currentUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(currentUsers.length / usersPerPage);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D866C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
        <h1 className="text-3xl font-bold text-[#5D866C] mb-2">User Management</h1>
        <p className="text-[#C2A68C]">Manage all users and their account status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#C2A68C] text-sm font-medium">Total Consumers</p>
              <p className="text-3xl font-bold text-[#5D866C]">{consumers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#C2A68C] text-sm font-medium">Total Vendors</p>
              <p className="text-3xl font-bold text-[#5D866C]">{vendors.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🏪
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#C2A68C] text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-[#5D866C]">
                {[...consumers, ...vendors].filter(user => user.active === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#C2A68C] text-sm font-medium">Banned Users</p>
              <p className="text-3xl font-bold text-[#5D866C]">
                {[...consumers, ...vendors].filter(user => user.active === 'banned').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🚫
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => {
              setActiveTab('consumers');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'consumers'
                ? 'bg-[#5D866C] text-white'
                : 'bg-[#E6D8C3] text-[#5D866C] hover:bg-[#C2A68C]/20'
            }`}
          >
            Consumers ({consumers.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('vendors');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'vendors'
                ? 'bg-[#5D866C] text-white'
                : 'bg-[#E6D8C3] text-[#5D866C] hover:bg-[#C2A68C]/20'
            }`}
          >
            Vendors ({vendors.length})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] focus:border-[#5D866C]"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] focus:border-[#5D866C]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <button
            onClick={fetchAllUsers}
            className="bg-[#5D866C] text-white px-4 py-2 rounded-lg hover:bg-[#5D866C]/80 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#E6D8C3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5D866C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E6D8C3]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#C2A68C]">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F5F5F0] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#5D866C] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#5D866C]">
                            {user.username || 'No username'}
                          </div>
                          <div className="text-sm text-[#C2A68C]">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#5D866C]">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#E6D8C3] text-[#5D866C]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(user.active)}`}>
                        {user.active || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C2A68C]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.active !== 'active' && (
                          <button
                            onClick={() => handleStatusUpdate(user._id, 'active')}
                            disabled={updatingUser === user._id}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {updatingUser === user._id ? '...' : 'Activate'}
                          </button>
                        )}
                        {user.active !== 'inactive' && (
                          <button
                            onClick={() => handleStatusUpdate(user._id, 'inactive')}
                            disabled={updatingUser === user._id}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          >
                            {updatingUser === user._id ? '...' : 'Deactivate'}
                          </button>
                        )}
                        {user.active !== 'banned' && (
                          <button
                            onClick={() => handleStatusUpdate(user._id, 'banned')}
                            disabled={updatingUser === user._id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {updatingUser === user._id ? '...' : 'Ban'}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-[#F5F5F0] px-6 py-3 flex items-center justify-between border-t border-[#E6D8C3]">
            <div className="text-sm text-[#C2A68C]">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, currentUsers.length)} of {currentUsers.length} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-white border border-[#C2A68C] text-[#5D866C] hover:bg-[#E6D8C3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-[#5D866C] text-white'
                      : 'bg-white border border-[#C2A68C] text-[#5D866C] hover:bg-[#E6D8C3]'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-white border border-[#C2A68C] text-[#5D866C] hover:bg-[#E6D8C3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;