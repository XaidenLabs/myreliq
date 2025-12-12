import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const MilestoneSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    achievedAt: { type: Date, required: true },
    metricLabel: { type: String, trim: true }, // e.g., "Users Reached"
    metricValue: { type: String, trim: true }, // e.g., "10,000"
    mediaUrl: { type: String }, // Image/Video link
    links: [{ type: String }],
  },
  { timestamps: true }
);

export type MilestoneDocument = HydratedDocument<
  InferSchemaType<typeof MilestoneSchema>
>;

export default models.Milestone || model("Milestone", MilestoneSchema);
