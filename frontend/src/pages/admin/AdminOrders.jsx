import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  cancelOrder 
} from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(token);
      setOrders(response.orders || response.allOrders || []);
      toast.success('Orders loaded successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus, token);
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);
      await cancelOrder(orderId, token);
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openOrderDetails = async (order) => {
    try {
      setSelectedOrder(order);
      setShowDetailsModal(true);
      
      // Optionally fetch more detailed order info
      // const detailedOrder = await getOrderDetails(order._id, token);
      // setSelectedOrder(detailedOrder.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowDetailsModal(false);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300'
    };

    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    };
    return stats;
  };

  const stats = getOrderStats();

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
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-blue-100">Track and manage all customer orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">Total Orders</p>
              <p className="text-xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
              📋
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-xs font-medium">Pending</p>
              <p className="text-xl font-bold text-blue-900">{stats.pending}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-sm">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">Processing</p>
              <p className="text-xl font-bold text-blue-900">{stats.processing}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
              🔄
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs font-medium">Delivered</p>
              <p className="text-xl font-bold text-blue-900">{stats.delivered}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-xs font-medium">Cancelled</p>
              <p className="text-xl font-bold text-blue-900">{stats.cancelled}</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">
              ❌
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs font-medium">Revenue</p>
              <p className="text-lg font-bold text-blue-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID, customer email, or username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <button
              onClick={fetchOrders}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="text-blue-600 text-sm mt-4">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-blue-400">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">No Orders Found</h3>
                    <p>No orders match your current filters.</p>
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          #{order._id?.slice(-8) || 'Unknown'}
                        </div>
                        <div className="text-sm text-blue-600">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          {order.user?.username || order.user?.email || 'Unknown'}
                        </div>
                        <div className="text-sm text-blue-600">
                          {order.user?.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-900">
                        {formatPrice(order.totalAmount || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                        {order.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                        >
                          👁️ View
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'processing')}
                            disabled={updatingOrderId === order._id}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {updatingOrderId === order._id ? '⏳' : '🔄'} Process
                          </button>
                        )}
                        
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                            disabled={updatingOrderId === order._id}
                            className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors disabled:opacity-50"
                          >
                            {updatingOrderId === order._id ? '⏳' : '🚚'} Ship
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                            disabled={updatingOrderId === order._id}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {updatingOrderId === order._id ? '⏳' : '✅'} Deliver
                          </button>
                        )}
                        
                        {!['cancelled', 'delivered'].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={updatingOrderId === order._id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {updatingOrderId === order._id ? '⏳' : '❌'} Cancel
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
          <div className="bg-blue-50 px-6 py-4 flex items-center justify-between border-t border-blue-200">
            <div className="text-sm text-blue-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = Math.max(1, currentPage - 2) + index;
                if (pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-10 flex flex-col">
            <div className="bg-blue-900 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-blue-100">Order #{selectedOrder._id?.slice(-8)}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Order ID:</span>
                        <span className="text-blue-900 font-mono">#{selectedOrder._id?.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedOrder.status)}`}>
                          {selectedOrder.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Total Amount:</span>
                        <span className="text-blue-900 font-semibold">{formatPrice(selectedOrder.totalAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Order Date:</span>
                        <span className="text-blue-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-600">Name:</span>
                        <span className="text-green-900">{selectedOrder.user?.username || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Email:</span>
                        <span className="text-green-900">{selectedOrder.user?.email || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="bg-white p-3 rounded border flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{item.product?.title || item.title || 'Unknown Product'}</div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity || 1}</div>
                          </div>
                          <div className="text-gray-900 font-semibold">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-3">Shipping Address</h3>
                    <div className="text-sm text-yellow-800">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t flex gap-4 flex-shrink-0">
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedOrder._id, 'processing');
                    closeModal();
                  }}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔄 Mark as Processing
                </button>
              )}
              
              {!['cancelled', 'delivered'].includes(selectedOrder.status) && (
                <button
                  onClick={() => {
                    handleCancelOrder(selectedOrder._id);
                    closeModal();
                  }}
                  className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
                >
                  ❌ Cancel Order
                </button>
              )}
              
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;