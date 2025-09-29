import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  console.log("user in header:", user);
  console.log('user username', user?.username);
  
  

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Hela Bazar
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link to="/cart" className="hover:text-blue-600">
            Cart
          </Link>
          <Link to="/wishlist" className="hover:text-blue-600">
            Wishlist
          </Link>
          <Link to="/orders" className="hover:text-blue-600">
            Orders
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="font-semibold text-blue-600">
                Hi, {user.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

