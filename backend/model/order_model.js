const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorApplication', required: true },
      name: String,               // Snapshot for order record
      image: String,              // Snapshot
      price: Number,              // Price at time of order
      quantity: Number,
      customization: Object       // Optional: engraving, color, etc.
    }
  ],

  shippingAddress: {
    name: { type: String, required: true },    // Who will receive
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, required: true }
  },

  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'bank', 'paypal', 'stripe'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  notes: { type: String }, // Optional order note for customer/vendor

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;