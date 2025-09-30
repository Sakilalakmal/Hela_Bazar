import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Helper: initial structure for a product sample
const blankProduct = { title: "", description: "", image: null };

function VendorApplicationForm() {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    businessName: "",
    taxId: "",
    category: "",
    certifications: "",
    businessDescription: "",
    contactPerson: { name: "", position: "", phone: "", email: "" },
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    website: "",
    socialMediaLinks: "",
    businessRegistrationNumber: "",
    storeType: "",
    paymentDetails: {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      paymentMethod: "bank",
    },
    preferredShippingMethods: "",
  });

  const [shopImages, setShopImages] = useState([]); // Array of files
  const [productSamples, setProductSamples] = useState([{ ...blankProduct }]);
  const [submitting, setSubmitting] = useState(false);

  // Input change helpers
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateContactPerson = (k, v) =>
    setForm((f) => ({
      ...f,
      contactPerson: { ...f.contactPerson, [k]: v },
    }));

  const updateBusinessAddress = (k, v) =>
    setForm((f) => ({
      ...f,
      businessAddress: { ...f.businessAddress, [k]: v },
    }));

  const updatePayment = (k, v) =>
    setForm((f) => ({
      ...f,
      paymentDetails: { ...f.paymentDetails, [k]: v },
    }));

  // Shop images change
  const handleShopImages = (e) => setShopImages([...e.target.files]);

  // Remove shop image
  const removeShopImage = (indexToRemove) => {
    setShopImages(shopImages.filter((_, index) => index !== indexToRemove));
  };

  // Product sample change
  const handleProductSample = (idx, k, v) => {
    const updated = [...productSamples];
    updated[idx][k] = v;
    setProductSamples(updated);
  };

  // Remove product sample image
  const removeProductImage = (idx) => {
    const updated = [...productSamples];
    updated[idx].image = null;
    setProductSamples(updated);
  };

  // Add/remove product sample rows
  const addSample = () => setProductSamples([...productSamples, { ...blankProduct }]);
  const removeSample = (idx) =>
    setProductSamples((samples) =>
      samples.length > 1 ? samples.filter((_, i) => i !== idx) : samples
    );

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare multipart form data (for file uploads)
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "object" && !Array.isArray(v)) {
          Object.entries(v).forEach(([kk, vv]) =>
            data.append(`${k}[${kk}]`, vv)
          );
        } else {
          data.append(k, v);
        }
      });

      // Certifications + shipping = comma-separated string
      if (form.certifications)
        data.set(
          "certifications",
          form.certifications.split(",").map((s) => s.trim())
        );
      if (form.preferredShippingMethods)
        data.set(
          "preferredShippingMethods",
          form.preferredShippingMethods.split(",").map((s) => s.trim())
        );

      // Shop images
      shopImages.forEach((file) => data.append("shopImages", file));

      // Product samples
      productSamples.forEach((ps, idx) => {
        data.append(`productTitle_${idx}`, ps.title);
        data.append(`productDescription_${idx}`, ps.description);
        if (ps.image) data.append("productImages", ps.image);
      });

      // Submit API call
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/vendor/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      const resp = await res.json();
      if (!res.ok) throw new Error(resp.message || "Application failed!");

      toast.success("Application submitted! Await admin approval.");
      // Reset form fields after successful submission
      setForm({
        businessName: "",
        taxId: "",
        category: "",
        certifications: "",
        businessDescription: "",
        contactPerson: { name: "", position: "", phone: "", email: "" },
        businessAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        website: "",
        socialMediaLinks: "",
        businessRegistrationNumber: "",
        storeType: "",
        paymentDetails: {
          bankName: "",
          accountNumber: "",
          routingNumber: "",
          paymentMethod: "bank",
        },
        preferredShippingMethods: "",
      });
      setShopImages([]);
      setProductSamples([{ ...blankProduct }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==== FORM UI ====
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">🏪</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Vendor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join Hela Bazar and start selling your amazing products to customers worldwide
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600 font-medium">Application Form</span>
              <span className="text-gray-500">Complete all required fields</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12" encType="multipart/form-data">
            
            {/* Business Information */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">🏢</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Business Name</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your business name"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Business Category</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="e.g. Clothing, Electronics, Art"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Tax ID</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your tax identification number"
                    value={form.taxId}
                    onChange={(e) => updateField("taxId", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Business Registration Number</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your business registration number"
                    value={form.businessRegistrationNumber}
                    onChange={(e) => updateField("businessRegistrationNumber", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Certifications</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="ISO 9001, Organic, Fair Trade (comma separated)"
                    value={form.certifications}
                    onChange={(e) => updateField("certifications", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Preferred Shipping Methods</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="DHL, FedEx, UPS (comma separated)"
                    value={form.preferredShippingMethods}
                    onChange={(e) => updateField("preferredShippingMethods", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Business Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Describe your business, products, and what makes you unique"
                  value={form.businessDescription}
                  rows={4}
                  onChange={(e) => updateField("businessDescription", e.target.value)}
                />
              </div>
            </section>

            {/* Contact Person */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Person</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter contact person's full name"
                    value={form.contactPerson.name}
                    onChange={(e) => updateContactPerson("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Position</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="CEO, Manager, Owner (optional)"
                    value={form.contactPerson.position}
                    onChange={(e) => updateContactPerson("position", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="+1 (555) 123-4567"
                    value={form.contactPerson.phone}
                    onChange={(e) => updateContactPerson("phone", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="contact@business.com"
                    value={form.contactPerson.email}
                    onChange={(e) => updateContactPerson("email", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Business Address */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Business Address</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Street Address</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="123 Business Street, Suite 100"
                    value={form.businessAddress.street}
                    onChange={(e) => updateBusinessAddress("street", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">City</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter city name"
                    value={form.businessAddress.city}
                    onChange={(e) => updateBusinessAddress("city", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">State/Province</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter state or province"
                    value={form.businessAddress.state}
                    onChange={(e) => updateBusinessAddress("state", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Zip/Postal Code</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="12345"
                    value={form.businessAddress.zipCode}
                    onChange={(e) => updateBusinessAddress("zipCode", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Country</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter country name"
                    value={form.businessAddress.country}
                    onChange={(e) => updateBusinessAddress("country", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Online Presence */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">🌐</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Online Presence</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Website URL</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="https://www.yourbusiness.com"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Social Media Links</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Facebook, Instagram, Twitter URLs (comma separated)"
                    value={form.socialMediaLinks}
                    onChange={(e) => updateField("socialMediaLinks", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Store Type & Payment Details */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">💳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Store & Payment Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Store Type</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Online, Physical, Hybrid"
                    value={form.storeType}
                    onChange={(e) => updateField("storeType", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={form.paymentDetails.paymentMethod}
                    onChange={(e) => updatePayment("paymentMethod", e.target.value)}
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bank Name</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your bank name"
                    value={form.paymentDetails.bankName}
                    onChange={(e) => updatePayment("bankName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Account Number</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your account number"
                    value={form.paymentDetails.accountNumber}
                    onChange={(e) => updatePayment("accountNumber", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Routing Number</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your routing number"
                    value={form.paymentDetails.routingNumber}
                    onChange={(e) => updatePayment("routingNumber", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Shop Images */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm">📸</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shop Images & Logo</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Upload Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      className="w-full"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleShopImages}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload your shop logo and interior/exterior photos. Maximum 5MB per file.
                    </p>
                  </div>
                </div>
                
                {/* Shop Images Preview */}
                {shopImages.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">Image Previews:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from(shopImages).map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Shop image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            onClick={() => removeShopImage(idx)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <p className="text-xs text-gray-500 mt-2 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Product Samples */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sample Products</h2>
              </div>
              
              <div className="space-y-6">
                {productSamples.map((ps, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Product Sample {idx + 1}
                      </h3>
                      {productSamples.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 px-3 py-1 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                          onClick={() => removeSample(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Product Title</label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Enter product name"
                          value={ps.title}
                          onChange={(e) => handleProductSample(idx, "title", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Brief product description"
                          value={ps.description}
                          onChange={(e) => handleProductSample(idx, "description", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Product Image</label>
                        <input
                          type="file"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          accept="image/*"
                          onChange={(e) => handleProductSample(idx, "image", e.target.files[0])}
                        />
                      </div>
                    </div>
                    
                    {/* Product Image Preview */}
                    {ps.image && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <div className="relative inline-block">
                          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                            <img
                              src={URL.createObjectURL(ps.image)}
                              alt={`Product ${idx + 1} preview`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            onClick={() => removeProductImage(idx)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{ps.image.name}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                  onClick={addSample}
                >
                  + Add Another Sample Product
                </button>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Vendor Application"
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Your application will be reviewed within 2-3 business days
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorApplicationForm;