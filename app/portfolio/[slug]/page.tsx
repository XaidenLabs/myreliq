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

      <main className="mx-auto max-w-5xl px-6 pt-24 pb-20">

        {/* Header Section */}
        <section className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Profile Image - Larger and more prominent */}
          <div className="flex justify-center mb-6">
            {profile.profileImage ? (
              <div className="relative">
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="h-32 w-32 rounded-full object-cover shadow-xl border-4 border-white ring-2 ring-[#ff4c2b]/20"
                />
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-[#ff4c2b] flex items-center justify-center border-4 border-white shadow-lg">
                  <IconBolt className="h-5 w-5 text-white" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#ff4c2b] to-[#ff6b4a] shadow-xl flex items-center justify-center text-5xl font-bold text-white border-4 border-white ring-2 ring-[#ff4c2b]/20">
                  {profile.fullName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white flex items-center justify-center border-4 border-[#ff4c2b] shadow-lg">
                  <IconBolt className="h-5 w-5 text-[#ff4c2b]" />
                </div>
              </div>
            )}
          </div>

          {/* Verified Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff4c2b]/30 bg-gradient-to-r from-[#fef7f5] to-[#ffece8] px-4 py-2 text-xs font-bold text-[#ff4c2b] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4c2b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4c2b]"></span>
            </span>
            Verified Proof-of-Work Portfolio
          </div>

          {/* Name */}
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#1f1e2a] mb-3 bg-gradient-to-r from-[#1f1e2a] to-[#3d3b4d] bg-clip-text">
            {profile.fullName}
          </h1>

          {/* Headline */}
          {profile.headline && (
            <p className="text-xl lg:text-2xl text-[#ff4c2b] font-semibold max-w-2xl mx-auto mb-4">
              {profile.headline}
            </p>
          )}

          {/* Location */}
          {profile.location && (
            <p className="text-sm text-[#7d7b8a] font-medium mb-6">
              📍 {profile.location}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-base text-[#5d5b66] max-w-2xl mx-auto leading-relaxed mb-8">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          {profile.socials && (Object.values(profile.socials).some(val => val)) && (
            <div className="flex items-center justify-center gap-3 mb-8">
              {profile.socials.github && (
                <a
                  href={`https://github.com/${profile.socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#1f1e2a]/10 text-[#1f1e2a] hover:border-[#ff4c2b] hover:text-[#ff4c2b] transition shadow-sm hover:shadow-md"
                  title="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {profile.socials.twitter && (
                <a
                  href={`https://twitter.com/${profile.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#1f1e2a]/10 text-[#1f1e2a] hover:border-[#ff4c2b] hover:text-[#ff4c2b] transition shadow-sm hover:shadow-md"
                  title="Twitter/X"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#1f1e2a]/10 text-[#1f1e2a] hover:border-[#ff4c2b] hover:text-[#ff4c2b] transition shadow-sm hover:shadow-md"
                  title="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {profile.socials.dribbble && (
                <a
                  href={`https://dribbble.com/${profile.socials.dribbble}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#1f1e2a]/10 text-[#1f1e2a] hover:border-[#ff4c2b] hover:text-[#ff4c2b] transition shadow-sm hover:shadow-md"
                  title="Dribbble"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
                  </svg>
                </a>
              )}
              {profile.socials.youtube && (
                <a
                  href={`https://youtube.com/@${profile.socials.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-[#1f1e2a]/10 text-[#1f1e2a] hover:border-[#ff4c2b] hover:text-[#ff4c2b] transition shadow-sm hover:shadow-md"
                  title="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Identities */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {identities.map((identity) => (
              <span key={identity.id} className="inline-flex items-center rounded-full bg-gradient-to-r from-white to-[#fef7f5] border border-[#ff4c2b]/20 px-5 py-2 text-sm font-bold text-[#1f1e2a] shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <IconSpark className="mr-2 h-4 w-4 text-[#ff4c2b]" />
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
