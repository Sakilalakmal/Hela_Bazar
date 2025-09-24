const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Vendor/owner

  name: { type: String, required: true },
  brand: { type: String }, // Optional
  description: { type: String, required: true },

  images: [{ type: String, required: true }], // Array of Cloudinary URLs

  category: { type: String, required: true },
  tags: [{ type: String }], // Optional (for search/filter)

  price: { type: Number, required: true },
  discount: {
    type: Number, // % discount, e.g. 10 = 10% off (optional)
    default: 0
  },
  stock: { type: Number, required: true }, // Inventory/quantity

  variants: [
    {
      optionName: { type: String }, // e.g., 'Size', 'Color'
      optionValues: [{ type: String }], // ['S', 'M', 'L'] or ['Red', 'Blue']
    }
  ],

  customizationOptions: [
    {
      type: { type: String }, // e.g., 'engraving', 'color', 'size'
      values: [{ type: String }]
    }
  ],

  rating: { type: Number, default: 0 },   // Average rating (calculated)
  reviewCount: { type: Number, default: 0 }, // Number of reviews

  // Optional: For SEO/friendly URLs
  slug: { type: String, unique: true },

  isActive: { type: Boolean, default: true }, // Visibility
  isFeatured: { type: Boolean, default: false }, // Featured on homepage

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{
    timestamps:true,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;