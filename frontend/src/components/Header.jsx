import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  console.log("user in header:", user);
  console.log('user username', user?.username);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <span className="text-white font-bold text-xl">HB</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hela Bazar
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/" 
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Products
            </Link>
            <Link 
              to="/cart" 
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
            >
              <span>Cart</span>
              {/* Cart badge placeholder */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0">
                0
              </span>
            </Link>
            <Link 
              to="/wishlist" 
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
            >
              <span>Wishlist</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0"></span>
            </Link>
            <Link 
              to="/orders" 
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              Orders
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-base font-medium text-gray-900">
                      Welcome back!
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">
                      {user.username}
                    </p>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-lg">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-6 py-3 text-base font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  to="/login"
                  className="px-6 py-3 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-xl hover:bg-blue-50"
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link
                  to="/register"
                  className="px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button className="p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu (hidden by default) */}
        <div className="lg:hidden border-t border-gray-100 py-6 space-y-2">
          <Link 
            to="/" 
            className="block px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="block px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className="block px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Cart
          </Link>
          <Link 
            to="/wishlist" 
            className="block px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Wishlist
          </Link>
          <Link 
            to="/orders" 
            className="block px-6 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            Orders
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;