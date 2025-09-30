import { useState } from "react";
import toast from "react-hot-toast";
import { updateVendorProfile } from "../services/vendorService";

const blankProduct = { title: "", description: "", image: null };

export default function EditVendorModal({ vendor, open, onClose, onUpdated, token }) {
  // Prefill all fields using vendor data (handle all nested objects/arrays!)
  const [form, setForm] = useState({
    businessName: vendor.businessName || "",
    taxId: vendor.taxId || "",
    category: vendor.category || "",
    certifications: vendor.certifications?.join(", ") || "",
    businessDescription: vendor.businessDescription || "",
    contactPerson: {
      name: vendor.contactPerson?.name || "",
      position: vendor.contactPerson?.position || "",
      phone: vendor.contactPerson?.phone || "",
      email: vendor.contactPerson?.email || "",
    },
    businessAddress: {
      street: vendor.businessAddress?.street || "",
      city: vendor.businessAddress?.city || "",
      state: vendor.businessAddress?.state || "",
      zipCode: vendor.businessAddress?.zipCode || "",
      country: vendor.businessAddress?.country || "",
    },
    website: vendor.website || "",
    socialMediaLinks: vendor.socialMediaLinks?.join(", ") || "",
    businessRegistrationNumber: vendor.businessRegistrationNumber || "",
    storeType: vendor.storeType || "",
    paymentDetails: {
      bankName: vendor.paymentDetails?.bankName || "",
      accountNumber: vendor.paymentDetails?.accountNumber || "",
      routingNumber: vendor.paymentDetails?.routingNumber || "",
      paymentMethod: vendor.paymentDetails?.paymentMethod || "bank",
    },
    preferredShippingMethods: vendor.preferredShippingMethods?.join(", ") || "",
  });

  // Images (edit: don't prefill files, show image preview; only upload new ones)
  const [shopImages, setShopImages] = useState([]);
  const [shopImagePreviews, setShopImagePreviews] = useState(vendor.shopImages || []);
  const [productSamples, setProductSamples] = useState(
    vendor.initialProductList && vendor.initialProductList.length
      ? vendor.initialProductList.map((p) => ({
          title: p.title,
          description: p.description,
          image: null, // For update, file upload
          imagePreview: p.images?.[0] || "",
        }))
      : [{ ...blankProduct }]
  );
  const [submitting, setSubmitting] = useState(false);

  // Field helpers
  const updateField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

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

  // Shop images (new uploads)
  const handleShopImages = (e) => setShopImages([...e.target.files]);
  const removeShopImage = (idx) =>
    setShopImages((imgs) => imgs.filter((_, i) => i !== idx));

  // Remove existing shop image preview
  const removeShopImagePreview = (idx) =>
    setShopImagePreviews((imgs) => imgs.filter((_, i) => i !== idx));

  // Product samples logic
  const handleProductSample = (idx, k, v) => {
    const updated = [...productSamples];
    updated[idx][k] = v;
    setProductSamples(updated);
  };
  const removeProductImage = (idx) => {
    const updated = [...productSamples];
    updated[idx].image = null;
    setProductSamples(updated);
  };
  const removeProductImagePreview = (idx) => {
    const updated = [...productSamples];
    updated[idx].imagePreview = "";
    setProductSamples(updated);
  };
  const addSample = () => setProductSamples([...productSamples, { ...blankProduct }]);
  const removeSample = (idx) =>
    setProductSamples((samples) =>
      samples.length > 1 ? samples.filter((_, i) => i !== idx) : samples
    );

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare multipart form data
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
      // Certifications + shipping
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
      if (form.socialMediaLinks)
        data.set(
          "socialMediaLinks",
          form.socialMediaLinks.split(",").map((s) => s.trim())
        );
      // New shop images only (old images kept on backend)
      shopImages.forEach((file) => data.append("shopImages", file));
      // Product samples
      productSamples.forEach((ps, idx) => {
        data.append(`productTitle_${idx}`, ps.title);
        data.append(`productDescription_${idx}`, ps.description);
        if (ps.image) data.append("productImages", ps.image);
      });

      await updateVendorProfile(data, token);
      toast.success("Business profile updated!");
      onClose();
      if (typeof onUpdated === "function") onUpdated();
    } catch (err) {
      toast.error(err.message || "Failed to update business profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // ----- UI -----
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white max-w-5xl w-full mx-4 rounded-xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Business Profile</h2>
            <p className="text-gray-600 mt-1">Update your business information and settings</p>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
            
            {/* Business Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Enter business name"
                    value={form.businessName} 
                    onChange={e=>updateField("businessName",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Business category"
                    value={form.category} 
                    onChange={e=>updateField("category",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Tax identification number"
                    value={form.taxId} 
                    onChange={e=>updateField("taxId",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Business registration number"
                    value={form.businessRegistrationNumber}
                    onChange={e=>updateField("businessRegistrationNumber",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Type *</label>
                  <select
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.storeType}
                    onChange={e=>updateField("storeType",e.target.value)}
                  >
                    <option value="">Select store type</option>
                    <option value="online">Online Only</option>
                    <option value="physical">Physical Store</option>
                    <option value="both">Both Online & Physical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={e=>updateField("website",e.target.value)} 
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Description *</label>
                <textarea 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Describe your business..."
                  value={form.businessDescription}
                  rows={3}
                  onChange={e=>updateField("businessDescription",e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="ISO, FDA, etc. (comma separated)"
                    value={form.certifications}
                    onChange={e=>updateField("certifications",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Methods</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="DHL, UPS, FedEx (comma separated)"
                    value={form.preferredShippingMethods}
                    onChange={e=>updateField("preferredShippingMethods",e.target.value)} 
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Facebook, Instagram, Twitter URLs (comma separated)"
                  value={form.socialMediaLinks}
                  onChange={e=>updateField("socialMediaLinks",e.target.value)} 
                />
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Full name"
                    value={form.contactPerson.name}
                    onChange={e=>updateContactPerson("name",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Job title"
                    value={form.contactPerson.position}
                    onChange={e=>updateContactPerson("position",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Phone number"
                    value={form.contactPerson.phone}
                    onChange={e=>updateContactPerson("phone",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    required 
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Email address"
                    value={form.contactPerson.email}
                    onChange={e=>updateContactPerson("email",e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Business Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Street address"
                    value={form.businessAddress.street}
                    onChange={e=>updateBusinessAddress("street",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="City"
                    value={form.businessAddress.city}
                    onChange={e=>updateBusinessAddress("city",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="State/Province"
                    value={form.businessAddress.state}
                    onChange={e=>updateBusinessAddress("state",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Zip/Postal code"
                    value={form.businessAddress.zipCode}
                    onChange={e=>updateBusinessAddress("zipCode",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Country"
                    value={form.businessAddress.country}
                    onChange={e=>updateBusinessAddress("country",e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Bank name"
                    value={form.paymentDetails.bankName}
                    onChange={e=>updatePayment("bankName",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                  <select 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.paymentDetails.paymentMethod}
                    onChange={e=>updatePayment("paymentMethod",e.target.value)}
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Account number"
                    value={form.paymentDetails.accountNumber}
                    onChange={e=>updatePayment("accountNumber",e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Routing number"
                    value={form.paymentDetails.routingNumber}
                    onChange={e=>updatePayment("routingNumber",e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Shop Images Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Shop Images
              </h3>
              
              {/* Existing Images */}
              {shopImagePreviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Current Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shopImagePreviews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img} 
                          className="w-full h-24 object-cover rounded-lg border border-gray-200" 
                          alt="shop preview" 
                        />
                        <button
                          type="button"
                          onClick={() => removeShopImagePreview(idx)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Images</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleShopImages}
                />
                {shopImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(shopImages).map((file, idx) => (
                      <div key={idx} className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-sm">
                        <span className="text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeShopImage(idx)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Samples Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Product Samples
              </h3>
              
              <div className="space-y-6">
                {productSamples.map((ps, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Product {idx + 1}</h4>
                      {productSamples.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => removeSample(idx)}
                        >
                          Remove Product
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                        <input 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          placeholder="Product title"
                          value={ps.title}
                          onChange={e=>handleProductSample(idx,"title",e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                        <input 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                          placeholder="Product description"
                          value={ps.description}
                          onChange={e=>handleProductSample(idx,"description",e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* Current Image Preview */}
                    {ps.imagePreview && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <div className="relative inline-block">
                          <img 
                            src={ps.imagePreview} 
                            alt="product preview" 
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
                          />
                          <button
                            type="button"
                            onClick={() => removeProductImagePreview(idx)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    {/* New Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {ps.imagePreview ? 'Replace Image' : 'Upload Image'}
                      </label>
                      <input
                        type="file"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        accept="image/*"
                        onChange={e => handleProductSample(idx, "image", e.target.files[0])}
                      />
                      {ps.image && (
                        <div className="mt-2 flex items-center bg-blue-50 rounded-lg px-3 py-2 text-sm">
                          <span className="text-blue-700">{ps.image.name}</span>
                          <button
                            type="button" 
                            className="ml-2 text-red-600 hover:text-red-800" 
                            onClick={()=>removeProductImage(idx)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                onClick={addSample}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Product Sample
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}