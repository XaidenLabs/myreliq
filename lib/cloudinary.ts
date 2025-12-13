import { v2 as cloudinary } from "cloudinary";

// Configure using the CLOUDINARY_URL environment variable properly
const [cloud_name, api_key, api_secret] = (process.env.CLOUDINARY_URL || "")
  .replace("cloudinary://", "")
  .split(/[:@]/)
  .filter(Boolean)
  .reverse(); // The format is api_key:api_secret @ cloud_name, so this split might be tricky.
// actually CLOUDINARY_URL is automatically handled by the SDK if strictly strictly defined.
// But explicit config is safer if the SDK version changes behavior.
// Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
// Split by @ -> [credentials, cloud_name]
// Split credentials by : -> [api_key, api_secret]

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
}

export default cloudinary;
