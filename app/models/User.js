import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String },
    password: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    address: { type: String },
    birthDate: { type: String },
    gender: { type: String },
    phoneNumber: { type: String },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a unique index on the email field
UserSchema.index({ email: 1 }, { unique: true });

export const User = models?.User || model("User", UserSchema);
