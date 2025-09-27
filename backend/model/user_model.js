const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "consumer",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    active:{
      type:String,
      enum:['active','inactive','banned'],
      default:'active',
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
