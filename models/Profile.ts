import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shareSlug: { type: String, unique: true, sparse: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    profileImage: { type: String },

    interests: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],

    // Kept simple embedded for now as they are less likely to be "entities" in themselves
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        startDate: { type: String }, // String for flexibility "2020", "Sept 2020"
        endDate: { type: String },
      },
    ],

    socials: {
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      dribbble: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },

    mintAddress: { type: String, trim: true }, // NFT Mint Address
    completionScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProfileDocument = HydratedDocument<
  InferSchemaType<typeof ProfileSchema>
>;

export default models.Profile || model("Profile", ProfileSchema);
