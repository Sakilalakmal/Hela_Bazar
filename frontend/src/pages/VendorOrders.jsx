import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getVendorOrders } from "../services/vendorService";
import toast from "react-hot-toast";

function VendorOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    getVendorOrders(token)
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast.error(err.message || "Could not fetch vendor orders");
      });
  }, [token]);

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "shipped":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-red-100 max-w-md text-center">
          <div className="text-4xl mb-4 text-red-400">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-16 shadow-lg border border-gray-200 max-w-lg text-center">
          <div className="text-6xl mb-6 text-gray-300">📦</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 text-lg">You haven't received any orders for your products yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">My Vendor Orders</h1>
          <p className="text-lg text-gray-600">Orders received for your products</p>
          <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Statistics - FIXED REVENUE CALCULATION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-800">{orders.length}</div>
            <div className="text-gray-600 font-medium">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(order => order.status === 'delivered').length}
            </div>
            <div className="text-gray-600 font-medium">Delivered</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {orders.filter(order => ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)).length}
            </div>
            <div className="text-gray-600 font-medium">In Progress</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-800">
              ${orders
                .filter(order => order.status !== 'cancelled') // EXCLUDE CANCELLED ORDERS
                .reduce((total, order) => total + order.totalAmount, 0)
                .toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium">Total Revenue</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-8">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="text-sm text-gray-500 font-medium mb-1">Order ID</div>
                    <div className="text-gray-800 font-mono text-sm mb-3">{order._id}</div>
                    <div className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  {/* Status and Payment Info */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="px-4 py-2 text-sm font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                      {order.paymentMethod?.toUpperCase() || "COD"}
                    </span>
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : order.paymentStatus === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 font-medium mb-1">Customer</div>
                      <div className="text-gray-800 font-semibold">
                        {order.customerId?.username || "Unknown Customer"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {order.customerId?.email || "No email"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium mb-1">Shipping Address</div>
                      <div className="text-gray-800 font-semibold">
                        {order.shippingAddress.name} • {order.shippingAddress.phone}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-4 text-xl">Products in this Order</h3>
                  <div className="space-y-4">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <img
                          src={
                            item.productId?.image ||
                            item.image ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.productId?.name || item.name || "Product"}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">
                            {item.productId?.name || item.name || "Unknown Product"}
                          </div>
                          <div className="text-gray-600 text-sm mb-2">
                            Quantity: {item.quantity} • Price: ${item.price}
                          </div>
                          <div className="text-gray-800 font-bold">
                            Total: ${(item.quantity * item.price).toFixed(2)}
                          </div>
                          {item.customization && (
                            <div className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded border border-gray-200">
                              <span className="font-medium">Customization: </span>
                              {typeof item.customization === 'string' 
                                ? item.customization 
                                : JSON.stringify(item.customization)
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    {order.notes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <span className="font-semibold text-amber-800">Order Notes: </span>
                        <span className="text-amber-700">{order.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium mb-1">Order Total</div>
                    <div className={`text-3xl font-bold ${
                      order.status === 'cancelled' ? 'text-red-500 line-through' : 'text-gray-800'
                    }`}>
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    {order.status === 'cancelled' && (
                      <div className="text-sm text-red-500 font-medium mt-1">Cancelled Order</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorOrders;