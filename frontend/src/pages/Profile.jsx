import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getVendorProfile } from "../services/vendorService";
import toast from "react-hot-toast";
import EditVendorModal from "../components/EditVendorModal";

function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Reload handler for after edit
  const reloadProfile = () => {
    setLoading(true);
    getVendorProfile(token)
      .then((data) => {
        setProfile(data.user);
        setVendor(data.vendorProfile);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Could not load profile");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) return;
    reloadProfile();
    // eslint-disable-next-line
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profile not found
          </h2>
          <p className="text-gray-600">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account and business information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {profile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.username}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {profile.role}
                </p>
              </div>
              {vendor && (
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Business
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member since</span>
                <p className="font-medium text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Account type</span>
                <p className="font-medium text-gray-900 capitalize">
                  {profile.role}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <p className="font-medium text-green-600">Active</p>
              </div>

              <button
                onClick={() => (window.location.href = "/my-products")}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                My Products
              </button>
            </div>
          </div>
        </div>

        {/* Vendor Application */}
        {vendor && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Vendor Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Business Information
                  </h2>
                  <p className="text-gray-600">
                    Your vendor application details
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    vendor.status
                  )}`}
                >
                  {vendor.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Business Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Business Name
                      </label>
                      <p className="font-medium text-gray-900">
                        {vendor.businessName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Category</label>
                      <p className="font-medium text-gray-900">
                        {vendor.category}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Store Type
                      </label>
                      <p className="font-medium text-gray-900 capitalize">
                        {vendor.storeType}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Tax ID</label>
                      <p className="font-medium text-gray-900">
                        {vendor.taxId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Registration Number
                      </label>
                      <p className="font-medium text-gray-900">
                        {vendor.businessRegistrationNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Application Date
                      </label>
                      <p className="font-medium text-gray-900">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {vendor.businessDescription}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Contact Person
                      </label>
                      <p className="font-medium text-gray-900">
                        {vendor.contactPerson.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vendor.contactPerson.position}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium text-gray-900">
                        {vendor.contactPerson.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">
                        {vendor.contactPerson.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Business Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-gray-700">
                    {vendor.businessAddress.street}
                    <br />
                    {vendor.businessAddress.city},{" "}
                    {vendor.businessAddress.state}{" "}
                    {vendor.businessAddress.zipCode}
                    <br />
                    {vendor.businessAddress.country}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Bank Name</label>
                    <p className="font-medium text-gray-900">
                      {vendor.paymentDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account</label>
                    <p className="font-medium text-gray-900">
                      ****{vendor.paymentDetails.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Method</label>
                    <p className="font-medium text-gray-900 capitalize">
                      {vendor.paymentDetails.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags and Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Certifications */}
                {vendor.certifications && vendor.certifications.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {vendor.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Methods */}
                {vendor.preferredShippingMethods &&
                  vendor.preferredShippingMethods.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Shipping Methods
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor.preferredShippingMethods.map(
                          (method, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium"
                            >
                              {method}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Social Media Links */}
              {vendor.socialMediaLinks &&
                vendor.socialMediaLinks.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Social Media
                    </h4>
                    <div className="space-y-2">
                      {vendor.socialMediaLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 underline text-sm break-all"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Shop Images */}
              {vendor.shopImages && vendor.shopImages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Shop Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vendor.shopImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Shop ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                          onClick={() => setSelectedImage(imageUrl)}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/200x150?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Samples */}
              {vendor.initialProductList &&
                vendor.initialProductList.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Samples
                    </h4>
                    <div className="space-y-4">
                      {vendor.initialProductList.map((product, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex gap-4">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer"
                                onClick={() =>
                                  setSelectedImage(product.images[0])
                                }
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/100x100?text=No+Image";
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">
                                {product.title}
                              </h5>
                              <p className="text-gray-600 text-sm">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && vendor && (
          <EditVendorModal
            vendor={vendor}
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdated={reloadProfile}
            token={token}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
