import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";
import Role from "@/models/Role";
import Milestone from "@/models/Milestone";

export const dynamic = 'force-dynamic';

async function getAdminStats() {
  await connectDB();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [profileCount, dailyProfileCount, roleCount, milestoneCount, recentProfiles] = await Promise.all([
    Profile.countDocuments(),
    Profile.countDocuments({ createdAt: { $gte: startOfDay } }),
    Role.countDocuments(),
    Milestone.countDocuments(),
    Profile.find().sort({ createdAt: -1 }).limit(6).populate("userId", "email").lean(),
  ]);

  return {
    profileCount,
    dailyProfileCount,
    roleCount,
    milestoneCount,
    recentProfiles: JSON.parse(JSON.stringify(recentProfiles)), // Serialize for Next.js
  };
}

export default async function AdminPage() {
  // await requireRole(["ADMIN", "SUPERADMIN"]); 

  const stats = await getAdminStats();

  return <AdminDashboardClient stats={stats} />;
}
