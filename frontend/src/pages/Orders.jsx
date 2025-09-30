import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderService";
import toast from "react-hot-toast";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState({}); // For expanding order details

  useEffect(() => {
    if (!token) {
      setMsg("Please login to view your orders.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getMyOrders(token)
      .then(data => {
        setOrders(data.orders);
        setOrderCount(data.orderCount || data.orders.length);
        setLoading(false);
        toast.success("Orders loaded!");
      })
      .catch(err => {
        setMsg(err.message);
        setLoading(false);
        toast.error(err.message || "Could not fetch your orders");
      });
  }, [token]);

  if (loading) return <p className="text-center py-10 text-lg">Loading your orders...</p>;
  if (msg) return <p className="text-center text-red-500 py-10">{msg}</p>;
  if (!orders.length)
    return <p className="text-center text-gray-600 py-10">You have no orders yet. Start shopping!</p>;

  // Utility for colored status badge
  const statusColor = status => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-purple-100 text-purple-700";
      case "shipped": return "bg-orange-100 text-orange-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <span className="block text-xs text-gray-400 mb-1">
                  Order ID: {order._id}
                </span>
                <span className="block text-sm text-gray-600">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {order.paymentMethod?.toUpperCase() || "COD"}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
                <span className="font-bold text-lg text-blue-700 ml-2">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Shipping To: {order.shippingAddress.name} | {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
              <button
                className="text-blue-600 font-semibold text-sm hover:underline"
                onClick={() =>
                  setExpanded(exp => ({
                    ...exp,
                    [order._id]: !exp[order._id],
                  }))
                }
              >
                {expanded[order._id] ? "Hide Details" : "Show Details"}
              </button>
            </div>
            {/* Order details: show if expanded */}
            {expanded[order._id] && (
              <div className="mt-5 border-t pt-5 space-y-4">
                <h3 className="font-bold mb-2">Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.products.map(item => (
                    <div key={item._id || item.productId?._id} className="flex gap-4 items-center p-2 bg-gray-50 rounded">
                      <img
                        src={item.image || item.productId?.image || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                        <div className="text-blue-700 font-bold text-sm">
                          ${item.price} {item.quantity > 1 && <span className="text-gray-400 ml-2">x {item.quantity}</span>}
                        </div>
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <div className="text-xs text-gray-400">Customization: {JSON.stringify(item.customization)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <div className="mt-4 text-gray-600 bg-yellow-50 p-3 rounded">
                    <span className="font-semibold">Order Notes: </span>
                    {order.notes}
                  </div>
                )}
                <div className="flex justify-end mt-2">
                  <span className="text-base text-gray-700 font-semibold">
                    Total: <span className="text-blue-700">${order.totalAmount.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
