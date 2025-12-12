import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const RoleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    identityId: {
      type: Schema.Types.ObjectId,
      ref: "Identity",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null = Text "Present"
    description: { type: String, required: true },
    workMode: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      required: true,
    },
    tags: [{ type: String, trim: true }],
    links: [{ type: String }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type RoleDocument = HydratedDocument<InferSchemaType<typeof RoleSchema>>;

export default models.Role || model("Role", RoleSchema);
