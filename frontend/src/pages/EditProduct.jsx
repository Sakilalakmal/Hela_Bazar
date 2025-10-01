import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getProductById,
  updateProduct,
} from "../services/updateProductDetailsService";
import { useAuth } from "../context/AuthContext";

// Helper for variants/customizations
const blankVariant = { optionName: "", optionValues: "" };
const blankCustomization = {
  type: "",
  values: "",
  priceType: "fixed",
  priceValue: "",
};

export default function EditProduct() {
  const { productId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    tags: "",
    price: "",
    stock: "",
    discount: "",
    slug: "",
    isActive: true,
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [customizations, setCustomizations] = useState([]);

  // Fetch product data on component mount
  useEffect(() => {
    if (!token || !productId) {
      navigate("/my-products");
      return;
    }

    getProductById(productId, token)
      .then((data) => {
        const product = data.product || data;

        // Pre-fill form with existing data
        setForm({
          name: product.name || "",
          brand: product.brand || "",
          description: product.description || "",
          category: product.category || "",
          tags: product.tags ? product.tags.join(", ") : "",
          price: product.price || "",
          stock: product.stock || "",
          discount: product.discount || "",
          slug: product.slug || "",
          isActive: product.isActive !== undefined ? product.isActive : true,
          isFeatured:
            product.isFeatured !== undefined ? product.isFeatured : false,
        });

        // Set current images
        setCurrentImages(product.images || []);

        // Set variants
        setVariants(
          product.variants && product.variants.length > 0
            ? product.variants.map((v) => ({
                optionName: v.optionName || "",
                optionValues: v.optionValues ? v.optionValues.join(", ") : "",
              }))
            : []
        );

        // Set customizations
        setCustomizations(
          product.customizationOptions &&
            product.customizationOptions.length > 0
            ? product.customizationOptions.map((c) => ({
                type: c.type || "",
                values: c.values ? c.values.join(", ") : "",
                priceType: c.priceType || "fixed",
                priceValue: c.priceValue || "",
              }))
            : []
        );

        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load product");
        navigate("/my-products");
      });
  }, [productId, token, navigate]);

  // Form handlers
  const addVariant = () => setVariants([...variants, { ...blankVariant }]);
  const removeVariant = (idx) =>
    setVariants(variants.filter((_, i) => i !== idx));
  const handleVariantChange = (idx, k, v) => {
    const arr = [...variants];
    arr[idx][k] = v;
    setVariants(arr);
  };

  const addCustomization = () =>
    setCustomizations([...customizations, { ...blankCustomization }]);
  const removeCustomization = (idx) =>
    setCustomizations(customizations.filter((_, i) => i !== idx));
  const handleCustomizationChange = (idx, k, v) => {
    const arr = [...customizations];
    arr[idx][k] = v;
    setCustomizations(arr);
  };

  const handleImages = (e) => setImages([...e.target.files]);
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));
  const removeCurrentImage = (idx) =>
    setCurrentImages(currentImages.filter((_, i) => i !== idx));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.price ||
      !form.stock
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const data = {
      ...form,
      tags: form.tags,
      variants: variants
        .filter((v) => v.optionName && v.optionValues)
        .map((v) => ({
          optionName: v.optionName,
          optionValues: v.optionValues.split(",").map((o) => o.trim()),
        })),
      customizationOptions: customizations
        .filter((c) => c.type && c.values)
        .map((c) => ({
          type: c.type,
          values: c.values.split(",").map((v) => v.trim()),
          priceType: c.priceType,
          priceValue: parseFloat(c.priceValue) || 0,
        })),
      images: images.length > 0 ? images : undefined,
    };

    setSubmitting(true);
    try {
      await updateProduct(productId, data, token);
      toast.success("Product updated successfully!");
      navigate("/my-products");
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Edit Product
            </h1>
            <p className="text-gray-600 text-lg">
              Update your product information
            </p>
          </div>
          <button
            onClick={() => navigate("/my-products")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Products
          </button>
        </div>
        <div className="w-16 h-1 bg-blue-600 rounded-full mt-4"></div>
      </div>

      <form
        className="space-y-10"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Basic Information Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Basic Information
              </h2>
              <p className="text-gray-600 text-sm">Essential product details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Name *
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Brand
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category *
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Enter product category"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="electronics, gadgets, smartphones"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate tags with commas
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Description *
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your product in detail..."
            />
          </div>
        </div>

        {/* Pricing & Inventory Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Pricing & Inventory
              </h2>
              <p className="text-gray-600 text-sm">
                Set your pricing and stock information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Price (LKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-medium">
                  ₨
                </span>
                <input
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Stock Quantity *
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Discount (%)
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                SEO Slug
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="product-name-slug"
              />
            </div>
          </div>
        </div>

        {/* Current Images Section */}
        {currentImages.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Current Images
                </h2>
                <p className="text-gray-600 text-sm">Existing product images</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    className="w-full h-24 rounded-lg border border-gray-200 object-cover group-hover:opacity-75 transition-opacity"
                    alt="Current"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                    onClick={() => removeCurrentImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Upload New Images
              </h2>
              <p className="text-gray-600 text-sm">
                Add new images or replace existing ones
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              className="hidden"
              id="images-upload"
              multiple
              accept="image/*"
              onChange={handleImages}
            />
            <label htmlFor="images-upload" className="cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload New Images
              </h3>
              <p className="text-gray-600 mb-4">
                Click to browse or drag and drop your images here
              </p>
              <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Files
              </div>
            </label>
          </div>

          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>• Maximum file size: 5MB per image</p>
            <p>• Supported formats: JPG, PNG</p>
            <p>• Recommended: Square images (1:1 ratio) for best results</p>
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                New Images Preview ({images.length} selected)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-24 rounded-lg border border-gray-200 object-cover group-hover:opacity-75 transition-opacity"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                      onClick={() => removeImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Variants Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Product Variants
                </h2>
                <p className="text-gray-600 text-sm">
                  Add size, color, or other product options
                </p>
              </div>
            </div>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
              onClick={addVariant}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No variants added yet. Click "Add Variant" to create product
                options.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Variant {idx + 1}
                    </h4>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      onClick={() => removeVariant(idx)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option Name
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="e.g., Size, Color, Material"
                        value={v.optionName}
                        onChange={(e) =>
                          handleVariantChange(idx, "optionName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option Values
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="e.g., S, M, L, XL"
                        value={v.optionValues}
                        onChange={(e) =>
                          handleVariantChange(
                            idx,
                            "optionValues",
                            e.target.value
                          )
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate values with commas
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customization Options Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Customization Options
                </h2>
                <p className="text-gray-600 text-sm">
                  Add engraving, personalization, or custom features
                </p>
              </div>
            </div>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
              onClick={addCustomization}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Customization
            </button>
          </div>

          {customizations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No customization options added yet. Click "Add Customization" to
                create custom features.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customizations.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Customization {idx + 1}
                    </h4>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      onClick={() => removeCustomization(idx)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customization Type
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="e.g., Engraving, Embroidery, Color"
                        value={c.type}
                        onChange={(e) =>
                          handleCustomizationChange(idx, "type", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Options
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        placeholder="e.g., Gold, Silver, Text Only"
                        value={c.values}
                        onChange={(e) =>
                          handleCustomizationChange(
                            idx,
                            "values",
                            e.target.value
                          )
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate options with commas
                      </p>
                    </div>

                    {/* Pricing Fields for Customizations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Type
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        value={c.priceType}
                        onChange={(e) =>
                          handleCustomizationChange(
                            idx,
                            "priceType",
                            e.target.value
                          )
                        }
                      >
                        <option value="fixed">Fixed Amount (+₨)</option>
                        <option value="percentage">Percentage (+%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Value ({c.priceType === "fixed" ? "₨" : "%"})
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        type="number"
                        min="0"
                        step={c.priceType === "fixed" ? "0.01" : "1"}
                        placeholder={c.priceType === "fixed" ? "500.00" : "10"}
                        value={c.priceValue}
                        onChange={(e) =>
                          handleCustomizationChange(
                            idx,
                            "priceValue",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Settings Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Product Settings
              </h2>
              <p className="text-gray-600 text-sm">
                Control product visibility and features
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                />
                <div>
                  <span className="font-semibold text-gray-900">
                    Active Product
                  </span>
                  <p className="text-sm text-gray-600">
                    Make this product visible to customers
                  </p>
                </div>
              </label>
            </div>
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                />
                <div>
                  <span className="font-semibold text-gray-900">
                    Featured Product
                  </span>
                  <p className="text-sm text-gray-600">
                    Show this product in featured sections
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Updating Product...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update Product
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
