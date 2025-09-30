import sriLankaVideo from "../assets/videos/Sri_Lanka_Promotional_Video_Creation.mp4";
import promo from '../assets/videos/promo.mp4';
import hero from "../assets/videos/hero.mp4";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={hero} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay for better text readability */}
          
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Hela Bazar
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Discover the finest products from the Pearl of the Indian Ocean
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Start Shopping
            </button>
            <button className="px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white rounded-xl font-semibold text-lg hover:bg-opacity-30 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* About Sri Lanka Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From the Heart of
              <span className="text-green-600"> Sri Lanka</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the rich heritage, vibrant culture, and exceptional
              craftsmanship that makes Sri Lankan products truly special.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌺</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Rich Cultural Heritage
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every product tells a story of centuries-old traditions and
                    skilled artisanship passed down through generations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏝️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Island of Quality
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    From world-renowned Ceylon tea to handcrafted textiles, Sri
                    Lanka offers products of unmatched quality and authenticity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Supporting Local Communities
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    By choosing Hela Bazar, you're directly supporting local
                    artisans, farmers, and small businesses across beautiful Sri
                    Lanka.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Video Section - FIXED */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={sriLankaVideo} type="video/mp4" />
                  {/* Fallback content only shows if video fails to load */}
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">Video unavailable</p>
                    </div>
                  </div>
                </video>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - NEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">Hela Bazar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted marketplace connecting Sri Lankan vendors with customers worldwide
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="prose prose-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Hela Bazar was born from a vision to showcase the incredible diversity and quality 
                  of Sri Lankan products to the world. We believe that every handcrafted item, 
                  every spice blend, and every textile tells a story of our rich cultural heritage.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our platform connects local vendors directly with customers, ensuring fair trade 
                  practices while bringing you authentic Sri Lankan products at their finest.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🛒</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Easy Shopping</h4>
                  <p className="text-sm text-gray-600">Browse, add to cart, and order with just a few clicks</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">❤️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wishlist</h4>
                  <p className="text-sm text-gray-600">Save your favorite items for later purchase</p>
                </div>
              </div>
            </div>

            {/* Right Content - Stats & Features */}
            <div className="space-y-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Products Available</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">100+</div>
                  <div className="text-green-100">Local Vendors</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-orange-100">Happy Customers</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-purple-100">Customer Support</div>
                </div>
              </div>

              {/* Platform Features */}
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Secure user authentication with OTP</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Advanced product search and filtering</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Shopping cart with customization options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Wishlist for saving favorite products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Product reviews and ratings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Order tracking and management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a bridge between Sri Lankan artisans and global customers, 
                promoting authentic products while supporting local communities.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the world's leading marketplace for authentic Sri Lankan products, 
                fostering cultural exchange and economic growth.
              </p>
            </div>

            {/* Values */}
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Authenticity, quality, fair trade, cultural preservation, 
                and exceptional customer service guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Discover authentic Sri Lankan products and bring a piece of paradise
            to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Browse Products
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;