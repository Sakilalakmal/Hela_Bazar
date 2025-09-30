import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { removeFromCart, clearCart } from "../services/cartService";
import toast from "react-hot-toast";

function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [notes, setNotes] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your cart.");
      setLoading(false);
      return;
    }
    getCart(token)
      .then((data) => {
        setCart(data.cart);
        setLoading(false);
      })
      .catch((err) => {
        setMsg(err.message);
        setLoading(false);
      });
  }, [token]);

  //! remove one cart from list
  // Handler to remove a single item
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId, token);
      setCart({
        ...cart,
        items: cart.items.filter(
          (item) => String(item.productId) !== String(productId)
        ),
      });
      toast.success("Item removed from cart.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handler to remove all items
  const handleClearCart = async () => {
    try {
      await clearCart(token);
      setCart({ ...cart, items: [] });
      toast.success("All items removed from cart.");
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-lg">Loading your cart...</p>;
  if (msg) return <p className="text-center text-red-500 py-10">{msg}</p>;
  if (!cart || cart.items.length === 0)
    return (
      <p className="text-center text-gray-600 py-10">Your cart is empty.</p>
    );

  // Remove All, Order Now, Delete Button logic will be added below
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <button
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold"
          onClick={handleClearCart}
        >
          Remove All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow p-6 border border-gray-200 gap-6"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-xl mb-4 md:mb-0"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{item.name}</h2>
              <p className="text-gray-500 mb-2">Qty: {item.quantity}</p>
              {item.customization &&
                Object.keys(item.customization).length > 0 && (
                  <p className="text-gray-400 text-sm mb-2">
                    Customization:{" "}
                    <span className="font-medium">
                      {JSON.stringify(item.customization)}
                    </span>
                  </p>
                )}
              <p className="font-bold text-blue-700 text-lg mb-2">
                ${item.price}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                // onClick={() => handleOrderNow(item._id)}
              >
                Order Now
              </button>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                onClick={() => handleRemoveFromCart(item.productId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showOrderForm && (
        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            onClick={() => setShowOrderForm(true)}
          >
            Place Order
          </button>
        </div>
      )}

      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Complete Your Order</h2>
                  <p className="text-blue-100">Enter your shipping details to proceed</p>
                </div>
                <button
                  onClick={() => setShowOrderForm(false)}
                  disabled={placingOrder}
                  className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPlacingOrder(true);
                try {
                  // API call to place order
                  const res = await fetch(
                    `${
                      import.meta.env.VITE_API_URL || "http://localhost:3000"
                    }/orders/placeorder`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                      body: JSON.stringify({
                        shippingAddress: shipping,
                        notes,
                        // paymentMethod: "cod", // default for now
                      }),
                    }
                  );
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Order failed");
                  toast.success(data.message || "Order placed successfully!");
                  setShowOrderForm(false);
                  setCart({ ...cart, items: [] });
                  // Optionally redirect or show "View Orders"
                } catch (err) {
                  toast.error(err.message);
                } finally {
                  setPlacingOrder(false);
                }
              }}
              className="p-8 space-y-8"
            >
              
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">📦</span>
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{cart.items.length} products</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">📍</span>
                  <h3 className="text-xl font-semibold text-gray-900">Shipping Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your full name"
                      value={shipping.name}
                      onChange={(e) =>
                        setShipping({ ...shipping, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your phone number"
                      value={shipping.phone}
                      onChange={(e) =>
                        setShipping({ ...shipping, phone: e.target.value })
                      }
                    />
                  </div>

                  {/* Street */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Street Address *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your street address"
                      value={shipping.street}
                      onChange={(e) =>
                        setShipping({ ...shipping, street: e.target.value })
                      }
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your city"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping({ ...shipping, city: e.target.value })
                      }
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State / Province</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your state"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping({ ...shipping, state: e.target.value })
                      }
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Zip / Postal Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter zip code"
                      value={shipping.zipCode}
                      onChange={(e) =>
                        setShipping({ ...shipping, zipCode: e.target.value })
                      }
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Country *</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your country"
                      value={shipping.country}
                      onChange={(e) =>
                        setShipping({ ...shipping, country: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm mr-3">📝</span>
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Notes</h3>
                </div>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Add any special delivery instructions or notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
                  onClick={() => setShowOrderForm(false)}
                  disabled={placingOrder}
                >
                  Cancel Order
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    placingOrder
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105"
                  } text-white shadow-lg`}
                  disabled={placingOrder}
                >
                  {placingOrder ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Order...
                    </div>
                  ) : (
                    "Confirm & Place Order"
                  )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">🔒</span>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Secure Checkout:</span> Your information is encrypted and secure. 
                    We use industry-standard security measures to protect your data.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;