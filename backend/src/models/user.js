import { Schema, model } from "mongoose";

const userSchema = new Schema({
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // allows multiple null/missing values without unique collisions
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  picture: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  provider: {
    type: String,
    enum: ["local", "google", "twitter", "facebook"],
    default: "local",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  }}, {
    timestamps: true
});

export const User = model("User", userSchema);
