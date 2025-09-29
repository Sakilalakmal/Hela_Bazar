import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";

function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setMsg("Please login to view your cart.");
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
          // onClick={handleClearCart}
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
                // onClick={() => handleRemoveFromCart(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
