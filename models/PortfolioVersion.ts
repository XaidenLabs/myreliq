import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const PortfolioVersionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    version: { type: Number, required: true },
    jsonHash: { type: String, required: true }, // SHA256 of the JSON blob
    solanaTx: { type: String }, // TX Signature
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure version is unique per user
PortfolioVersionSchema.index({ userId: 1, version: 1 }, { unique: true });

export type PortfolioVersionDocument = HydratedDocument<
  InferSchemaType<typeof PortfolioVersionSchema>
>;

export default models.PortfolioVersion ||
  model("PortfolioVersion", PortfolioVersionSchema);
