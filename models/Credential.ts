import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const CredentialSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: String, trim: true }, // Could be ref to Org model if exists later
    title: { type: String, required: true, trim: true },
    description: { type: String },
    metadataUri: { type: String, required: true }, // IPFS link
    mintAddress: { type: String }, // Solana Mint Address
    status: {
      type: String,
      enum: ["issued", "revoked", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type CredentialDocument = HydratedDocument<
  InferSchemaType<typeof CredentialSchema>
>;

export default models.Credential || model("Credential", CredentialSchema);
