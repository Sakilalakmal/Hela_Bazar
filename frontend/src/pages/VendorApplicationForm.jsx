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
  const [productSamples, setProductSamples] = useState([blankProduct]);
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

  // Product sample change
  const handleProductSample = (idx, k, v) => {
    const updated = [...productSamples];
    updated[idx][k] = v;
    setProductSamples(updated);
  };

  // Add/remove product sample rows
  const addSample = () => setProductSamples([...productSamples, blankProduct]);
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
      setProductSamples([blankProduct]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==== FORM UI ====
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-xl mt-10 mb-20 border border-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Vendor Application
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-7"
        encType="multipart/form-data"
      >
        {/* Business Information */}
        <div>
          <h2 className="font-bold text-lg mb-2">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="input"
              placeholder="Business Name"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Business Category (e.g. Clothing, Art)"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Tax ID"
              value={form.taxId}
              onChange={(e) => updateField("taxId", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Business Registration Number"
              value={form.businessRegistrationNumber}
              onChange={(e) =>
                updateField("businessRegistrationNumber", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Certifications (comma separated)"
              value={form.certifications}
              onChange={(e) => updateField("certifications", e.target.value)}
            />
            <input
              className="input"
              placeholder="Preferred Shipping Methods (comma separated)"
              value={form.preferredShippingMethods}
              onChange={(e) =>
                updateField("preferredShippingMethods", e.target.value)
              }
            />
          </div>
          <textarea
            required
            className="input mt-2"
            placeholder="Business Description"
            value={form.businessDescription}
            rows={2}
            onChange={(e) => updateField("businessDescription", e.target.value)}
          />
        </div>

        {/* Contact Person */}
        <div>
          <h2 className="font-bold text-lg mb-2">Contact Person</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="input"
              placeholder="Full Name"
              value={form.contactPerson.name}
              onChange={(e) => updateContactPerson("name", e.target.value)}
            />
            <input
              className="input"
              placeholder="Position (optional)"
              value={form.contactPerson.position}
              onChange={(e) => updateContactPerson("position", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Phone"
              value={form.contactPerson.phone}
              onChange={(e) => updateContactPerson("phone", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Email"
              value={form.contactPerson.email}
              onChange={(e) => updateContactPerson("email", e.target.value)}
            />
          </div>
        </div>

        {/* Business Address */}
        <div>
          <h2 className="font-bold text-lg mb-2">Business Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="input"
              placeholder="Street"
              value={form.businessAddress.street}
              onChange={(e) => updateBusinessAddress("street", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="City"
              value={form.businessAddress.city}
              onChange={(e) => updateBusinessAddress("city", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="State"
              value={form.businessAddress.state}
              onChange={(e) => updateBusinessAddress("state", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Zip Code"
              value={form.businessAddress.zipCode}
              onChange={(e) => updateBusinessAddress("zipCode", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Country"
              value={form.businessAddress.country}
              onChange={(e) => updateBusinessAddress("country", e.target.value)}
            />
          </div>
        </div>

        {/* Online Presence */}
        <div>
          <h2 className="font-bold text-lg mb-2">Online Presence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Website (optional)"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
            <input
              className="input"
              placeholder="Social Media Links (comma separated, optional)"
              value={form.socialMediaLinks}
              onChange={(e) => updateField("socialMediaLinks", e.target.value)}
            />
          </div>
        </div>

        {/* Store Type & Payment Details */}
        <div>
          <h2 className="font-bold text-lg mb-2">
            Store Type & Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="input"
              placeholder="Store Type (e.g. online, retail)"
              value={form.storeType}
              onChange={(e) => updateField("storeType", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Bank Name"
              value={form.paymentDetails.bankName}
              onChange={(e) => updatePayment("bankName", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Bank Account Number"
              value={form.paymentDetails.accountNumber}
              onChange={(e) => updatePayment("accountNumber", e.target.value)}
            />
            <input
              required
              className="input"
              placeholder="Routing Number"
              value={form.paymentDetails.routingNumber}
              onChange={(e) => updatePayment("routingNumber", e.target.value)}
            />
            <select
              required
              className="input"
              value={form.paymentDetails.paymentMethod}
              onChange={(e) => updatePayment("paymentMethod", e.target.value)}
            >
              <option value="bank">Bank</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
        </div>

        {/* Shop Images */}
        <div>
          <h2 className="font-bold text-lg mb-2">Shop Images / Logo</h2>
          <input
            required
            className="input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleShopImages}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {shopImages.length > 0 &&
              Array.from(shopImages).map((file, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {file.name}
                </span>
              ))}
          </div>
        </div>

        {/* Product Samples */}
        <div>
          <h2 className="font-bold text-lg mb-2">Sample Products</h2>
          {productSamples.map((ps, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-end"
            >
              <input
                required
                className="input"
                placeholder="Product Title"
                value={ps.title}
                onChange={(e) =>
                  handleProductSample(idx, "title", e.target.value)
                }
              />
              <input
                required
                className="input"
                placeholder="Description"
                value={ps.description}
                onChange={(e) =>
                  handleProductSample(idx, "description", e.target.value)
                }
              />
              <input
                required
                type="file"
                className="input"
                accept="image/*"
                onChange={(e) =>
                  handleProductSample(idx, "image", e.target.files[0])
                }
              />
              {productSamples.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-xs text-red-500"
                  onClick={() => removeSample(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 mt-2 underline text-sm"
            onClick={addSample}
          >
            + Add another sample product
          </button>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 rounded-lg shadow mt-6"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendorApplicationForm;
