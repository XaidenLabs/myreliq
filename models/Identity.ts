import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const IdentitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true }, // e.g., "Full Stack Dev"
    slug: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    profileImage: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
    mintAddress: { type: String, trim: true },
    metadataUri: { type: String },
  },
  { timestamps: true }
);

// Composite unique index to ensure slugs are unique per user
IdentitySchema.index({ userId: 1, slug: 1 }, { unique: true });

export type IdentityDocument = HydratedDocument<
  InferSchemaType<typeof IdentitySchema>
>;

export default models.Identity || model("Identity", IdentitySchema);
