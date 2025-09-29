import { useEffect, useState } from "react";
import {useAuth} from "../context/authContext";
import { getWishlist , removeFromWishlist ,clearWishlist} from "../services/wishlistService";
import {Link} from "react-router-dom";
function Wishlist() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token) {
      setMsg("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }
    getWishlist(token)
      .then(data => {
        setWishlist(data.wishList);
        setLoading(false);
      })
      .catch(err => {
        setMsg(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleRemoveWishListItem = async(productId)=>{
      try {
    await removeFromWishlist(productId, token);
    // Option 1: re-fetch wishlist
    const data = await getWishlist(token);
    setWishlist(data.wishList);

  } catch (err) {
    setMsg(err.message);
  }
  }

  const clearWishlistAll = async () => {
    try {
      await clearWishlist(token);
      setWishlist({ products: [] });
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (loading) return <p className="text-center py-10">Loading wishlist...</p>;
  if (msg) return <p className="text-center text-red-500 py-10">{msg}</p>;
  if (!wishlist || wishlist.products.length === 0)
    return <p className="text-center text-gray-600 py-10">Your wishlist is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <button onClick={clearWishlistAll}>Remove All</button>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

          

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.products.map((p) => (
          <div key={p._id} className="bg-white rounded-xl shadow-md p-4 border">
            <Link to={`/products/${p._id}`}>
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="font-semibold text-lg">{p.name}</h2>
            </Link>
            <p className="text-sm text-gray-600">{p.brand}</p>
            <p className="font-bold text-blue-600 mt-2">${p.price}</p>
            <p className="text-xs text-gray-400 mt-1">{p.description?.slice(0, 60)}...</p>

             <button
  onClick={() => handleRemoveWishListItem(p._id)}
  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
>
  Remove
</button>
          </div>
        ))}
      </div>

     
    </div>
  );
}

export default Wishlist;
