import { useState } from "react";
import toast from "react-hot-toast";
import { addProduct } from "../services/product_Add";
import { useAuth } from "../context/AuthContext";

// Helper for variants/customizations
const blankVariant = { optionName: "", optionValues: "" };
const blankCustomization = { type: "", values: "" };

export default function AddProductForm() {
  const { token } = useAuth();
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
  const [variants, setVariants] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Add/remove helpers
  const addVariant = () => setVariants([...variants, { ...blankVariant }]);
  const removeVariant = (idx) => setVariants(variants.filter((_, i) => i !== idx));
  const handleVariantChange = (idx, k, v) => {
    const arr = [...variants];
    arr[idx][k] = v;
    setVariants(arr);
  };

  const addCustomization = () => setCustomizations([...customizations, { ...blankCustomization }]);
  const removeCustomization = (idx) => setCustomizations(customizations.filter((_, i) => i !== idx));
  const handleCustomizationChange = (idx, k, v) => {
    const arr = [...customizations];
    arr[idx][k] = v;
    setCustomizations(arr);
  };

  const handleImages = (e) => setImages([...e.target.files]);
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));

  // Handle form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category || !form.price || !form.stock || images.length === 0) {
      toast.error("Please fill all required fields and add at least one image.");
      return;
    }

    const data = {
      ...form,
      tags: form.tags, // let service handle string->array
      variants: variants.filter(v => v.optionName && v.optionValues).map(v => ({
        optionName: v.optionName,
        optionValues: v.optionValues.split(",").map(o => o.trim()),
      })),
      customizationOptions: customizations.filter(c => c.type && c.values).map(c => ({
        type: c.type,
        values: c.values.split(",").map(v => v.trim()),
      })),
      images,
    };

    setSubmitting(true);
    try {
      await addProduct(data, token);
      toast.success("Product added successfully!");
      // Reset form after success
      setForm({
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
      setImages([]);
      setVariants([]);
      setCustomizations([]);
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Product Name *</label>
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Brand</label>
          <input className="input" name="brand" value={form.brand} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Category *</label>
          <input className="input" name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
          <input className="input" name="tags" value={form.tags} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Price (LKR) *</label>
          <input className="input" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Stock *</label>
          <input className="input" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Discount (%)</label>
          <input className="input" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Slug (SEO, optional)</label>
          <input className="input" name="slug" value={form.slug} onChange={handleChange} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description *</label>
        <textarea className="input" name="description" value={form.description} onChange={handleChange} required rows={4} />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold mb-2">Product Images *</label>
        <input type="file" className="input" multiple accept="image/*" onChange={handleImages} />
        <p className="text-xs text-gray-400 mt-1">Maximum 5MB each. JPG/PNG only.</p>
        {images.length > 0 && (
          <div className="flex gap-3 mt-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={URL.createObjectURL(img)} className="w-20 h-20 rounded border object-cover" alt="Preview" />
                <button type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  onClick={() => removeImage(idx)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variants (Size, Color, etc) */}
      <div>
        <label className="block text-sm font-semibold mb-2">Variants (optional)</label>
        {variants.map((v, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input className="input" placeholder="Option (e.g. Size)" value={v.optionName}
              onChange={e => handleVariantChange(idx, "optionName", e.target.value)} />
            <input className="input" placeholder="Values (comma, e.g. S,M,L)" value={v.optionValues}
              onChange={e => handleVariantChange(idx, "optionValues", e.target.value)} />
            <button type="button" className="text-red-500 text-xs" onClick={() => removeVariant(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-blue-600 underline text-sm" onClick={addVariant}>+ Add Variant</button>
      </div>

      {/* Customization Options */}
      <div>
        <label className="block text-sm font-semibold mb-2">Customization Options (optional)</label>
        {customizations.map((c, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input className="input" placeholder="Type (e.g. Engraving)" value={c.type}
              onChange={e => handleCustomizationChange(idx, "type", e.target.value)} />
            <input className="input" placeholder="Values (comma, e.g. Gold,Silver)" value={c.values}
              onChange={e => handleCustomizationChange(idx, "values", e.target.value)} />
            <button type="button" className="text-red-500 text-xs" onClick={() => removeCustomization(idx)}>Remove</button>
          </div>
        ))}
        <button type="button" className="text-blue-600 underline text-sm" onClick={addCustomization}>+ Add Customization</button>
      </div>

      {/* Visibility & Featured */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <span>Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
          <span>Featured</span>
        </label>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
            submitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }` }>
          {submitting ? "Adding Product..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}
