import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import ProfileModel from "@/models/Profile";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://myreliq.com"; // Replace with actual domain

  // 1. Static Routes
  const routes = ["", "/auth/login", "/auth/register"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Dynamic Routes (Public Portfolios)
  let portfolioRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();
    // Only fetch profiles that have a shareSlug and are likely "public"/complete
    const profiles = await ProfileModel.find({
      shareSlug: { $exists: true, $ne: null },
    })
      .select("shareSlug updatedAt")
      .lean();

    portfolioRoutes = profiles.map((profile: any) => ({
      url: `${baseUrl}/portfolio/${profile.shareSlug}`,
      lastModified: profile.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9, // High priority for user portfolios
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...routes, ...portfolioRoutes];
}
