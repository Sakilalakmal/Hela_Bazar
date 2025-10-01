import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  getUserReview,
  createReview,
  updateReview,
  deleteReview,
} from "../services/orderService";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Modal & order detail
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  // Review Form States
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState(null);
  const [cancelFromModal, setCancelFromModal] = useState(false);

  // Delete review confirm
  const [confirmDeleteReview, setConfirmDeleteReview] = useState(false);
  const [pendingDeleteReviewId, setPendingDeleteReviewId] = useState(null);

  useEffect(() => {
    if (!token) {
      setMsg("Please login to view your orders.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getMyOrders(token)
      .then((data) => {
        setOrders(data.orders);
        setLoading(false);
      })
      .catch((err) => {
        setMsg(err.message);
        setLoading(false);
        toast.error(err.message || "Could not fetch your orders");
      });
  }, [token]);

  // Modal details
  const handleShowDetails = async (orderId) => {
    setShowModal(true);
    setSelectedOrderId(orderId);
    setOrderDetails(null);
    setDetailsLoading(true);
    try {
      const data = await getOrderDetails(orderId, token);
      setOrderDetails(data.order);
      setDetailsLoading(false);
    } catch (err) {
      setOrderDetails(null);
      setDetailsLoading(false);
      toast.error(err.message || "Could not get order details");
    }
  };

  // Review Modal Functions
  const openReviewModal = async (product, orderId) => {
    setSelectedProduct({ ...product, orderId });
    setShowReviewModal(true);
    setReviewLoading(true);
    setIsEditingReview(false);
    setExistingReview(null);
    
    try {
      // Check if user already has a review for this product/order
      const reviewData = await getUserReview(product.productId?._id || product.productId, orderId, token);
      if (reviewData.review) {
        setExistingReview(reviewData.review);
        setReviewForm({
          rating: reviewData.review.rating,
          reviewText: reviewData.review.reviewText
        });
        setIsEditingReview(true);
      } else {
        setReviewForm({ rating: 5, reviewText: '' });
      }
    } catch (err) {
      // No existing review, that's fine
      setReviewForm({ rating: 5, reviewText: '' });
    }
    
    setReviewLoading(false);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    setExistingReview(null);
    setIsEditingReview(false);
    setReviewForm({ rating: 5, reviewText: '' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setReviewLoading(true);
    
    try {
      const reviewData = {
        productId: selectedProduct.productId?._id || selectedProduct.productId,
        orderId: selectedProduct.orderId,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText.trim()
      };

      if (isEditingReview && existingReview) {
        await updateReview(existingReview._id, reviewData, token);
        toast.success('Review updated successfully!');
      } else {
        await createReview(reviewData, token);
        toast.success('Review submitted successfully!');
      }
      
      closeReviewModal();
      
      // Refresh order details if modal is open
      if (showModal && selectedOrderId === selectedProduct.orderId) {
        handleShowDetails(selectedOrderId);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
    
    setReviewLoading(false);
  };

  const startDeleteReview = (reviewId) => {
    setPendingDeleteReviewId(reviewId);
    setConfirmDeleteReview(true);
  };

  const confirmDeleteReviewAction = async () => {
    setConfirmDeleteReview(false);
    
    if (!pendingDeleteReviewId) return;
    
    try {
      await deleteReview(pendingDeleteReviewId, token);
      toast.success('Review deleted successfully!');
      closeReviewModal();
      
      // Refresh order details if modal is open
      if (showModal && selectedOrderId) {
        handleShowDetails(selectedOrderId);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
    
    setPendingDeleteReviewId(null);
  };

  const cancelDeleteReview = () => {
    setConfirmDeleteReview(false);
    setPendingDeleteReviewId(null);
  };

  // ConfirmDialog logic
  const startCancelOrder = (orderId, fromModal = false) => {
    setPendingCancelOrderId(orderId);
    setCancelFromModal(fromModal);
    setConfirmOpen(true);
  };

  const confirmCancelOrder = async () => {
    setConfirmOpen(false);
    if (!pendingCancelOrderId) return;
    await doCancelOrder(pendingCancelOrderId, cancelFromModal);
    setPendingCancelOrderId(null);
    setCancelFromModal(false);
  };

  const cancelDialog = () => {
    setConfirmOpen(false);
    setPendingCancelOrderId(null);
    setCancelFromModal(false);
  };

  // Cancel order logic
  const doCancelOrder = async (orderId, fromModal = false) => {
    try {
      await cancelOrder(orderId, token);
      toast.success("Order cancelled successfully!");
      setLoading(true);
      getMyOrders(token)
        .then((data) => {
          setOrders(data.orders);
          setLoading(false);
        })
        .catch((err) => {
          setMsg(err.message);
          setLoading(false);
        });

      // If details modal open, update it
      if (fromModal && orderId === selectedOrderId) {
        setDetailsLoading(true);
        try {
          const data = await getOrderDetails(orderId, token);
          setOrderDetails(data.order);
        } catch {
          setOrderDetails(null);
        }
        setDetailsLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-orange-100 text-orange-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isCancellable = (order) =>
    order.status !== "cancelled" && order.status !== "delivered";

  if (loading)
    return <p className="text-center py-10 text-lg">Loading your orders...</p>;
  if (msg) return <p className="text-center text-red-500 py-10">{msg}</p>;
  if (!orders.length)
    return (
      <p className="text-center text-gray-600 py-10">
        You have no orders yet. Start shopping!
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 relative">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-6 border border-gray-200"
          >
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {order.paymentMethod?.toUpperCase() || "COD"}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
                <span className="font-bold text-lg text-blue-700 ml-2">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Shipping To: {order.shippingAddress.name} |{" "}
                  {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  className="text-blue-600 font-semibold text-sm hover:underline"
                  onClick={() => handleShowDetails(order._id)}
                >
                  Show Details
                </button>
                {isCancellable(order) && (
                  <button
                    className="text-red-600 font-semibold text-sm hover:underline"
                    onClick={() => startCancelOrder(order._id, false)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Details Modal with Review Buttons */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 mx-4 max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => {
                setShowModal(false);
                setOrderDetails(null);
              }}
            >
              ×
            </button>
            {detailsLoading ? (
              <div className="text-center py-16">Loading order details...</div>
            ) : orderDetails ? (
              <>
                <h2 className="text-xl font-bold mb-3">
                  Order #{orderDetails._id}
                </h2>
                <div className="mb-3 text-gray-500">
                  Placed on: {new Date(orderDetails.createdAt).toLocaleString()}
                </div>
                <div className="mb-2 flex gap-3 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                      orderDetails.status
                    )}`}
                  >
                    {orderDetails.status.charAt(0).toUpperCase() +
                      orderDetails.status.slice(1)}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {orderDetails.paymentMethod?.toUpperCase() || "COD"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      orderDetails.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : orderDetails.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {orderDetails.paymentStatus.charAt(0).toUpperCase() +
                      orderDetails.paymentStatus.slice(1)}
                  </span>
                  <span className="font-bold text-lg text-blue-700 ml-2">
                    ${orderDetails.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Shipping To: {orderDetails.shippingAddress.name} |{" "}
                    {orderDetails.shippingAddress.phone}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {orderDetails.shippingAddress.street},{" "}
                    {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.country}
                  </p>
                </div>
                <h3 className="font-bold mb-2">Products</h3>
                <div className="space-y-2 mb-4">
                  {orderDetails.products.map((item) => (
                    <div
                      key={item._id || item.productId?._id}
                      className="flex gap-4 items-center p-2 bg-gray-50 rounded"
                    >
                      <img
                        src={
                          item.image ||
                          item.productId?.image ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-blue-700 font-bold text-sm">
                          ${item.price}
                        </div>
                        {item.customization &&
                          Object.keys(item.customization).length > 0 && (
                            <div className="text-xs text-gray-400">
                              Customization:{" "}
                              {JSON.stringify(item.customization)}
                            </div>
                          )}
                        
                        {/* Review Button - Only show for delivered orders */}
                        {orderDetails.status === 'delivered' && (
                          <div className="mt-2">
                            <button
                              onClick={() => openReviewModal(item, orderDetails._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                            >
                              Review Product
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {orderDetails.notes && (
                  <div className="mt-4 text-gray-600 bg-yellow-50 p-3 rounded">
                    <span className="font-semibold">Order Notes: </span>
                    {orderDetails.notes}
                  </div>
                )}
                {isCancellable(orderDetails) && (
                  <button
                    className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
                    onClick={() => startCancelOrder(orderDetails._id, true)}
                  >
                    Cancel This Order
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-red-500">
                Order details not found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-200 mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-400 hover:text-red-500 text-2xl font-light transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              {reviewLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Product Info */}
                  <div className="flex gap-4 items-center mb-6 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={selectedProduct?.image || selectedProduct?.productId?.image || "https://via.placeholder.com/60"}
                      alt={selectedProduct?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{selectedProduct?.name}</div>
                      <div className="text-gray-600 text-sm">${selectedProduct?.price}</div>
                    </div>
                  </div>

                  {/* Review Form */}
                  <form onSubmit={handleReviewSubmit}>
                    {/* Star Rating */}
                    <div className="mb-6">
                      <label className="block text-gray-800 font-semibold mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-3xl transition-colors duration-200 ${
                              star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                      <label className="block text-gray-800 font-semibold mb-2">Review</label>
                      <textarea
                        value={reviewForm.reviewText}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                        placeholder="Share your experience with this product..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isEditingReview ? 'Update Review' : 'Submit Review'}
                      </button>
                      
                      {isEditingReview && existingReview && (
                        <button
                          type="button"
                          onClick={() => startDeleteReview(existingReview._id)}
                          className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 border border-red-200 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Review Dialog */}
      {confirmDeleteReview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <ConfirmDialog
              open={confirmDeleteReview}
              title="Delete Review?"
              message="Are you sure you want to delete this review? This action cannot be undone."
              onConfirm={confirmDeleteReviewAction}
              onCancel={cancelDeleteReview}
            />
          </div>
        </div>
      )}

      {/* Blurred background ConfirmDialog for cancel */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <ConfirmDialog
              open={confirmOpen}
              title="Cancel this order?"
              message="Are you sure you want to cancel this order? This cannot be undone."
              onConfirm={confirmCancelOrder}
              onCancel={cancelDialog}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;