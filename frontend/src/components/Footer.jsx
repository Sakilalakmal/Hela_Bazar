import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-lg">HB</span>
              </div>
              <span className="text-xl font-bold text-white">
                Hela Bazar
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop marketplace for authentic Sri Lankan products. 
              Discover amazing deals and shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200">
                <span className="text-sm font-semibold">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200">
                <span className="text-sm font-semibold">t</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200">
                <span className="text-sm font-semibold">i</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200">
                <span className="text-sm font-semibold">y</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <button className="px-4 py-2 bg-white text-black font-semibold rounded-r-lg hover:bg-gray-200 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Secure Payment</p>
                <p className="text-gray-400 text-xs">SSL Encrypted</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">🚚</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Free Shipping</p>
                <p className="text-gray-400 text-xs">On orders $50+</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">↺</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Easy Returns</p>
                <p className="text-gray-400 text-xs">30 day policy</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">★</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Best Quality</p>
                <p className="text-gray-400 text-xs">Premium products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Hela Bazar. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Contact
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-2">We Accept:</span>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-white border border-gray-300 rounded text-black text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-white border border-gray-300 rounded text-black text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-10 h-6 bg-white border border-gray-300 rounded text-black text-xs flex items-center justify-center font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;