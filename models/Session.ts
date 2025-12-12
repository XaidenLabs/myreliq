import { Schema, model, models, type InferSchemaType } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    deviceName: { type: String },
    revokedAt: { type: Date },
  },
  { timestamps: true },
);

export type SessionDocument = InferSchemaType<typeof SessionSchema>;

export default models.Session || model("Session", SessionSchema);
