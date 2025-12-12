import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    walletAddress: { type: String, unique: true, sparse: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERADMIN"],
      default: "USER",
    },
    emailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type UserDocument = HydratedDocument<InferSchemaType<typeof UserSchema>>;

export default models.User || model("User", UserSchema);
