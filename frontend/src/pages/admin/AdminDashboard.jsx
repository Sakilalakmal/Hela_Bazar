// Create new file: frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllConsumers , getAllOrders , getAllProducts , getAllReviews ,getAllVendors  , getOrderDetails , getVendorApplications } from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    orders: 0,
    products: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [usersRes, vendorsRes, ordersRes, productsRes, reviewsRes] = await Promise.all([
        getAllConsumers(token),
        getAllVendors(token),
        getAllOrders(token),
        getAllProducts(token),
        getAllReviews(token)
      ]);

      setStats({
        users: usersRes.consumerCount || 0,
        vendors: vendorsRes.vendorCount || 0,
        orders: ordersRes.orderCount || 0,
        products: productsRes.productCount || 0,
        reviews: reviewsRes.reviewCount || 0
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: '👥', color: 'bg-blue-500', path: '/admin/users' },
    { title: 'Total Vendors', value: stats.vendors, icon: '🏪', color: 'bg-green-500', path: '/admin/vendors' },
    { title: 'Total Orders', value: stats.orders, icon: '🛒', color: 'bg-yellow-500', path: '/admin/orders' },
    { title: 'Total Products', value: stats.products, icon: '📦', color: 'bg-purple-500', path: '/admin/products' },
    { title: 'Total Reviews', value: stats.reviews, icon: '⭐', color: 'bg-pink-500', path: '/admin/reviews' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D866C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
        <h1 className="text-3xl font-bold text-[#5D866C] mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-[#C2A68C]">Manage your entire marketplace from this central hub.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = card.path}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#C2A68C] text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-[#5D866C]">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <h3 className="text-xl font-bold text-[#5D866C] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left bg-[#E6D8C3] hover:bg-[#C2A68C]/20 p-3 rounded-lg transition-colors">
              📋 View Pending Vendor Applications
            </button>
            <button className="w-full text-left bg-[#E6D8C3] hover:bg-[#C2A68C]/20 p-3 rounded-lg transition-colors">
              🚨 Review Reported Content
            </button>
            <button className="w-full text-left bg-[#E6D8C3] hover:bg-[#C2A68C]/20 p-3 rounded-lg transition-colors">
              📊 Generate Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E6D8C3] p-6">
          <h3 className="text-xl font-bold text-[#5D866C] mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-[#C2A68C]">
            <p>• New user registered 2 hours ago</p>
            <p>• Vendor application submitted 4 hours ago</p>
            <p>• Product reported 6 hours ago</p>
            <p>• Order disputed yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;