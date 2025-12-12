import { IconBolt, IconMilestone, IconRoles, IconSpark } from "@/components/icons";
import { connectDB } from "@/lib/db";
import ProfileModel from "@/models/Profile";
import IdentityModel from "@/models/Identity";
import RoleModel from "@/models/Role";
import MilestoneModel from "@/models/Milestone";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Identity, Role, Milestone, Profile } from "@/lib/types";

// Force dynamic behavior so it always fetches fresh data on visit
export const dynamic = "force-dynamic";

async function getPortfolioData(slug: string) {
  await connectDB();

  // 1. Find Profile by slug
  const profileDoc = await ProfileModel.findOne({ shareSlug: slug }).lean();
  if (!profileDoc) return null;

  const userId = profileDoc.userId;

  // 2. Fetch related data in parallel
  const [identitiesDoc, rolesDoc, milestonesDoc] = await Promise.all([
    IdentityModel.find({ userId }).lean(),
    RoleModel.find({ userId }).lean(),
    MilestoneModel.find({ userId }).lean(),
  ]);

  // 3. Serialize for serialization-safe passing to Client Components (if any) or just rendering
  const profile: Profile = JSON.parse(JSON.stringify({ ...profileDoc, id: profileDoc._id }));
  const identities: Identity[] = JSON.parse(JSON.stringify(identitiesDoc.map(d => ({ ...d, id: d._id }))));
  const roles: Role[] = JSON.parse(JSON.stringify(rolesDoc.map(d => ({ ...d, id: d._id }))));
  const milestones: Milestone[] = JSON.parse(JSON.stringify(milestonesDoc.map(d => ({ ...d, id: d._id }))));

  return { profile, identities, roles, milestones };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  // Handle Next.js 15 params promise (safe for 14 too if passed as promise, otherwise await on object is no-op)
  const { slug } = await params;
  const data = await getPortfolioData(slug);

  if (!data) {
    notFound();
  }

  const { profile, identities, roles, milestones } = data;

  return (
    <div className="min-h-screen bg-[#fef7f5] text-[#1f1e2a] font-sans selection:bg-[#ff4c2b]/20">
      {/* Top Navigation / Branding */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#1f1e2a]/5 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4c2b] text-white shadow-lg shadow-[#ff4c2b]/20">
              <IconBolt className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">myreliq</span>
          </div>
          <a
            href="/"
            className="rounded-full border border-[#1f1e2a]/10 bg-white px-4 py-1.5 text-xs font-bold text-[#5d5b66] transition hover:bg-[#1f1e2a] hover:text-white"
          >
            Create Your Own
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">

        {/* Header Section */}
        <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-white shadow-sm border border-[#1f1e2a]/5 flex items-center justify-center text-4xl font-bold text-[#ff4c2b] mb-6">
            {profile.fullName.charAt(0)}
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff4c2b]/20 bg-[#fef7f5] px-3 py-1 text-xs font-bold text-[#ff4c2b]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4c2b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4c2b]"></span>
            </span>
            Verified Proof-of-Work
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#1f1e2a] mb-4">
            {profile.fullName}
          </h1>
          {profile.headline && (
            <p className="text-xl text-[#5d5b66] font-medium max-w-2xl mx-auto mb-6">
              {profile.headline}
            </p>
          )}
          {profile.bio && (
            <p className="text-base text-[#5d5b66] max-w-2xl mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {identities.map((identity) => (
              <span key={identity.id} className="inline-flex items-center rounded-full bg-white border border-[#1f1e2a]/5 px-4 py-1.5 text-sm font-bold text-[#1f1e2a] shadow-sm transition hover:-translate-y-0.5">
                <IconSpark className="mr-2 h-3 w-3 text-[#ff4c2b]" />
                {identity.name}
              </span>
            ))}
          </div>
        </section>

        {/* Roles & Milestones */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {roles.map((role) => (
            <div key={role.id} className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm border border-[#1f1e2a]/5 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-[#1f1e2a]">{role.title}</h2>
                    <span className="rounded-lg bg-[#ffece8] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ff4c2b]">
                      {role.workMode}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-[#5d5b66]">{role.organization}</p>
                </div>
                <div className="text-right md:text-right text-sm font-bold text-[#7d7b8a] bg-gray-50 px-3 py-1 rounded-xl self-start whitespace-nowrap">
                  {format(new Date(role.startDate), "MMM yyyy")} — {role.endDate ? format(new Date(role.endDate), "MMM yyyy") : "Present"}
                </div>
              </div>

              <p className="text-[#5d5b66] leading-relaxed mb-8 max-w-3xl border-l-2 border-gray-100 pl-4">
                {role.description}
              </p>

              {/* Milestones for this role */}
              {milestones.filter(m => m.roleId === role.id).length > 0 && (
                <div className="bg-[#fef7f5] rounded-3xl p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6 text-[#ff4c2b]">
                    <IconMilestone className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Key Milestones</span>
                  </div>
                  <div className="space-y-6">
                    {milestones.filter(m => m.roleId === role.id).map(milestone => (
                      <div key={milestone.id} className="relative pl-6 border-l-2 border-[#ff4c2b]/20">
                        <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#ff4c2b]"></div>
                        <h4 className="text-lg font-bold text-[#1f1e2a] flex items-center gap-3">
                          {milestone.title}
                          <span className="text-xs font-medium text-[#7d7b8a] bg-white px-2 py-0.5 rounded-md border border-[#1f1e2a]/5">
                            {milestone.date && !isNaN(new Date(milestone.date).getTime()) ? format(new Date(milestone.date), "MMM yyyy") : "No Date"}
                          </span>
                        </h4>
                        <p className="mt-1 text-sm text-[#5d5b66]">{milestone.description}</p>
                        {milestone.metrics && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1f1e2a] shadow-sm border border-[#1f1e2a]/5">
                            <IconSpark className="h-3 w-3 text-[#ff4c2b]" />
                            {milestone.metrics}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#1f1e2a]/10">
            <IconRoles className="h-12 w-12 text-[#ff4c2b] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1f1e2a] mb-2">No History Yet</h3>
            <p className="text-[#5d5b66]">This user hasn't added any roles or milestones yet.</p>
          </div>
        )}

      </main>

      <footer className="border-t border-[#1f1e2a]/5 bg-white py-12 text-center text-sm text-[#5d5b66]">
        <div className="mb-4 flex items-center justify-center gap-2 font-bold text-[#1f1e2a]">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#ff4c2b] text-white">
            <IconBolt className="h-3 w-3" />
          </div>
          myreliq
        </div>
        <p>© {new Date().getFullYear()} Reliq. All rights reserved.</p>
      </footer>
    </div>
  );
}
