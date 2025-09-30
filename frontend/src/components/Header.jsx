import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log("user in header:", user);
  console.log("user username", user?.username);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <span className="text-white font-bold text-xl">HB</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                Hela Bazar
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
            >
              <span>Cart</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0">
                0
              </span>
            </Link>
            <Link
              to="/wishlist"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
            >
              <span>Wishlist</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0"></span>
            </Link>
            <Link
              to="/orders"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Orders
            </Link>

            {/* Become Vendor Button - Special Styling */}
            {user && user.role === "consumer" && (
              <button
                onClick={() => navigate("/become-vendor")}
                className="ml-3 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg border-2 border-emerald-600 hover:border-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Join as Vendor
              </button>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">
                      Welcome back!
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {user.username}
                    </p>
                  </div>

                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>

                {/* Register Button */}
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center ml-4">
            <button className="p-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden border-t border-slate-100 py-4 space-y-1">
          <Link
            to="/"
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Cart
          </Link>
          <Link
            to="/wishlist"
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Wishlist
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Orders
          </Link>

          {/* Mobile Become Vendor Button */}
          {user && user.role === "consumer" && (
            <button
              onClick={() => navigate("/become-vendor")}
              className="block w-full mt-3 px-4 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg border-2 border-emerald-600 hover:border-emerald-700 transition-all duration-200 text-center"
            >
              Join as Vendor
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;