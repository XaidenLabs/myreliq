import { GhostButton, PrimaryButton } from "@/components/ui/Buttons";
import { IconBolt, IconMilestone, IconRoles, IconShare, IconSpark, IconStack, IconSun } from "@/components/icons";
// import { requireRole } from "@/lib/auth-guards"; // Temporarily disabled for dev flow
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";
import Role from "@/models/Role";
import Milestone from "@/models/Milestone";
import { format } from "date-fns";
import Link from "next/link";
import { Profile as ProfileType } from "@/lib/types";

// Helper components
const StatCard = ({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper?: string;
  icon: any;
}) => (
  <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-[#1f1e2a]/5">
    <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#fef7f5] transition-transform group-hover:scale-110"></div>
    <div className="relative">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef7f5] text-[#ff4c2b]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7b8a]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-[#1f1e2a]">{value}</p>
      <p className="mt-1 text-sm font-medium text-[#5d5b66]">{helper}</p>
    </div>
  </div>
);

async function getAdminStats() {
  await connectDB();
  const [profileCount, roleCount, milestoneCount, recentProfiles] = await Promise.all([
    Profile.countDocuments(),
    Role.countDocuments(),
    Milestone.countDocuments(),
    Profile.find().sort({ createdAt: -1 }).limit(6).populate("userId", "email").lean(),
  ]);

  return {
    profileCount,
    roleCount,
    milestoneCount,
    recentProfiles: JSON.parse(JSON.stringify(recentProfiles)), // Serialize for Next.js
  };
}

export default async function AdminPage() {
  // await requireRole(["ADMIN", "SUPERADMIN"]); 

  const { profileCount, roleCount, milestoneCount, recentProfiles } = await getAdminStats();

  return (
    <div className="min-h-screen bg-[#fef7f5] text-[#1f1e2a] flex">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col justify-between border-r border-[#1f1e2a]/5 bg-white px-6 py-8 md:flex fixed h-full z-10">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4c2b] text-white shadow-lg shadow-[#ff4c2b]/20">
              <IconBolt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">myreliq</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4c2b]">Admin</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 font-medium text-base">
            <GhostButton label="Overview" href="#" className="!justify-start !bg-[#1f1e2a] !text-white !shadow-lg !shadow-[#1f1e2a]/10" />
            <GhostButton label="Users" href="#" className="!justify-start !text-[#5d5b66] hover:!bg-[#ffece8] hover:!text-[#ff4c2b]" />
            <GhostButton label="Audit Logs" href="#" className="!justify-start !text-[#5d5b66] hover:!bg-[#ffece8] hover:!text-[#ff4c2b]" />
            <GhostButton label="Settings" href="#" className="!justify-start !text-[#5d5b66] hover:!bg-[#ffece8] hover:!text-[#ff4c2b]" />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 transition-all duration-500">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 bg-white/80 px-6 py-5 backdrop-blur-xl md:px-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a]">Admin Dashboard</h1>
            <p className="text-sm font-medium text-[#5d5b66] mt-1">Platform overview and user management.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#1f1e2a]/10 bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold text-[#1f1e2a]">System Healthy</span>
            </div>
          </div>
        </header>

        <main className="px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Users"
              value={profileCount.toString()}
              helper="Active profiles"
              icon={IconSpark}
            />
            <StatCard
              label="Total Roles"
              value={roleCount.toString()}
              helper="Experience records"
              icon={IconRoles}
            />
            <StatCard
              label="Milestones"
              value={milestoneCount.toString()}
              helper="Achievements logged"
              icon={IconMilestone}
            />
            <StatCard
              label="Queue"
              value="0"
              helper="Awaiting verification"
              icon={IconStack}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Portfolios */}
            <section className="lg:col-span-2 rounded-[2.5rem] bg-white p-8 shadow-sm border border-[#1f1e2a]/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-[#1f1e2a]">Newest Portfolios</h2>
                  <p className="text-sm text-[#5d5b66] mt-1">Latest creators joining the ecosystem.</p>
                </div>
                <GhostButton label="View All" href="#" className="!text-xs" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#1f1e2a]/5">
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a]">User</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a]">Link</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a]">Joined</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1e2a]/5">
                    {recentProfiles.map((p: any) => (
                      <tr key={p._id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#fef7f5] flex items-center justify-center font-bold text-[#ff4c2b]">
                              {(p.fullName || "?").charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1f1e2a]">{p.fullName}</p>
                              <p className="text-xs text-[#5d5b66]">{p.userId?.email || "No Email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <code className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-semibold text-[#5d5b66]">
                            /{p.shareSlug}
                          </code>
                        </td>
                        <td className="py-4 text-sm font-medium text-[#5d5b66]">
                          {format(new Date(p.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* System Health / Audit - Placeholder */}
            <section className="rounded-[2.5rem] bg-[#1f1e2a] p-8 shadow-lg text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <IconSun className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">System Status</h3>
                  <p className="text-white/60 text-sm">All systems operational</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    name: "Catalyst U",
                    type: "University",
                    reason: "Launching next cohort in Lagos",
                    initial: "C"
                  },
                  { name: "Sol Builders DAO", type: "Community", reason: "Credential issuer", initial: "S" },
                  { name: "CreateCamp", type: "Bootcamp", reason: "Capstone credential", initial: "T" },
                ].map((org) => (
                  <div
                    key={org.name}
                    className="flex flex-col gap-3 rounded-2xl bg-[#fef7f5] p-5 border border-[#1f1e2a]/5 transition hover:border-[#ff4c2b]/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-[#1f1e2a] font-bold text-xs shadow-sm">
                          {org.initial}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1f1e2a]">{org.name}</p>
                          <p className="text-[10px] uppercase tracking-wider text-[#7d7b8a]">{org.type}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#5d5b66] leading-relaxed  pl-11">{org.reason}</p>
                    <div className="flex gap-2 pl-11">
                      <button className="rounded-lg bg-[#ff4c2b] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#e64426]">Approve</button>
                      <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#5d5b66] border border-[#1f1e2a]/10 hover:bg-gray-50">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
