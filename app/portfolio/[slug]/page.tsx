import { IconBolt } from "@/components/icons";
import { Metadata } from 'next';
import { connectDB } from "@/lib/db";
import ProfileModel from "@/models/Profile";
import IdentityModel from "@/models/Identity";
import RoleModel from "@/models/Role";
import MilestoneModel from "@/models/Milestone";
import CredentialModel from "@/models/Credential";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Identity, Role, Milestone, Profile, Credential } from "@/lib/types";

// Force dynamic behavior so it always fetches fresh data on visit
export const dynamic = "force-dynamic";

async function getPortfolioData(slug: string) {
  await connectDB();

  // 1. Find Profile by slug
  const profileDoc = await ProfileModel.findOne({ shareSlug: slug }).lean();
  if (!profileDoc) return null;

  const userId = profileDoc.userId;

  // 2. Fetch related data in parallel
  const [identitiesDoc, rolesDoc, milestonesDoc, credentialsDoc] = await Promise.all([
    IdentityModel.find({ userId }).lean(),
    RoleModel.find({ userId }).lean(),
    MilestoneModel.find({ userId }).lean(),
    CredentialModel.find({ userId, status: { $ne: "revoked" } }).lean(),
  ]);

  // 3. Serialize for serialization-safe passing to Client Components (if any) or just rendering
  const profile: Profile = JSON.parse(JSON.stringify({ ...profileDoc, id: profileDoc._id }));
  const identities: Identity[] = JSON.parse(JSON.stringify(identitiesDoc.map(d => ({ ...d, id: d._id }))));
  const roles: Role[] = JSON.parse(JSON.stringify(rolesDoc.map(d => ({ ...d, id: d._id }))));
  const milestones: Milestone[] = JSON.parse(JSON.stringify(milestonesDoc.map(d => ({ ...d, id: d._id }))));
  const credentials: Credential[] = JSON.parse(JSON.stringify(credentialsDoc.map(d => ({ ...d, id: d._id }))));

  return { profile, identities, roles, milestones, credentials };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const profile = await ProfileModel.findOne({ shareSlug: slug }).lean();

  if (!profile) {
    return {
      title: 'Profile Not Found | Myreliq',
      description: 'The requested profile could not be found.',
    };
  }

  const title = `${profile.fullName} | Portfolio | Myreliq`;
  const description = profile.bio ? profile.bio.substring(0, 160) : `Check out ${profile.fullName}'s professional portfolio on Myreliq.`;
  const images = profile.profileImage ? [{ url: profile.profileImage }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'profile',
      url: `https://myreliq.com/portfolio/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  // Handle Next.js 15 params promise
  const { slug } = await params;
  const data = await getPortfolioData(slug);

  if (!data) {
    notFound();
  }

  const { profile, identities, roles, milestones, credentials } = data;

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans print:bg-white">
      {/* Header Section - Red Background */}
      <header className="bg-gradient-to-r from-[#ff4c2b] to-[#ff6b4a] text-white px-6 py-12 print:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Image */}
            <div className="shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-4 border-white shadow-xl print:w-24 print:h-24"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-4 border-white shadow-xl bg-white/20 flex items-center justify-center text-6xl font-bold print:w-24 print:h-24">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>

            {/* Name and Contact Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 print:text-3xl">{profile.fullName}</h1>
              {profile.headline && (
                <p className="text-xl md:text-2xl font-medium mb-4 text-white/90 print:text-lg">{profile.headline}</p>
              )}

              {/* Contact Information */}
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.socials?.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white/80 transition print:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>{profile.socials.linkedin}</span>
                  </a>
                )}
                {profile.socials?.website && (
                  <a
                    href={profile.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white/80 transition print:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <span>Website</span>
                  </a>
                )}
                {profile.socials?.twitter && (
                  <a
                    href={`https://twitter.com/${profile.socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white/80 transition print:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>@{profile.socials.twitter}</span>
                  </a>
                )}
                {profile.socials?.github && (
                  <a
                    href={`https://github.com/${profile.socials.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white/80 transition print:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>{profile.socials.github}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 print:py-4">

        {/* About Me Section */}
        {profile.bio && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-[#ff4c2b] mb-4 print:text-xl">About Me</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm print:shadow-none print:border print:border-gray-300">
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {roles.length > 0 && (
          <section className="mb-8 print:mb-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#ff4c2b] mb-6 print:text-xl">Experience</h2>
            <div className="bg-[#fce8e8] rounded-lg p-8 print:bg-white print:border print:border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 print:grid-cols-1 print:gap-6 relative">
                {/* Vertical separator line - only visible on desktop */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 print:hidden" />

                {roles.map((role) => {
                  const roleMilestones = milestones.filter(m => m.roleId === role.id);
                  return (
                    <div key={role.id} className="print:break-inside-avoid">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{role.organization}</h3>
                      <p className="font-semibold text-gray-800 mb-2">{role.title}</p>
                      <p className="text-sm text-gray-600 mb-3">
                        {format(new Date(role.startDate), "do MMMM")} - {role.endDate ? format(new Date(role.endDate), "do MMMM yyyy") : "Present"}
                      </p>

                      {/* Description or Milestones as bullet points */}
                      {(role.description || roleMilestones.length > 0) && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {role.description && (
                            <li>{role.description}</li>
                          )}
                          {roleMilestones.slice(0, 3).map(milestone => (
                            <li key={milestone.id}>{milestone.title}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <section className="mb-8 print:mb-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#ff4c2b] mb-4 print:text-xl">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 print:gap-2">
              {profile.education.map((edu, index) => (
                <div key={index} className="bg-white border-l-4 border-[#ff4c2b] rounded-lg p-5 shadow-sm print:border print:border-gray-300 print:break-inside-avoid">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{edu.school}</h3>
                  <p className="font-semibold text-gray-800 mb-2">{edu.degree}</p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-sm text-gray-600">
                      {edu.startDate || ""} {edu.startDate && edu.endDate && "—"} {edu.endDate || ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tools Proficiency Section */}
        {profile.tools && profile.tools.length > 0 && (
          <section className="mb-8 print:mb-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#ff4c2b] mb-4 print:text-xl">Tools Proficiency</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4 print:shadow-none print:border print:border-gray-300">
              {profile.tools.map((tool, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-900">{tool.name}</span>
                    <span className="text-sm text-gray-600">{tool.proficiency}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden print:h-2">
                    <div
                      className="bg-gradient-to-r from-[#ff4c2b] to-[#ff6b4a] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(tool.proficiency / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {credentials && credentials.length > 0 && (
          <section className="mb-8 print:mb-6 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#ff4c2b] mb-4 print:text-xl">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 print:gap-2">
              {credentials.map((credential) => (
                <div key={credential.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition print:shadow-none print:border print:border-gray-300 print:break-inside-avoid">
                  {/* Certificate Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 print:h-24">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 print:h-12 print:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  {/* Credential Info */}
                  <div className="p-4 bg-gradient-to-r from-[#ff4c2b] to-[#ff6b4a] text-white">
                    <h3 className="font-bold text-sm mb-1">{credential.title}</h3>
                    {credential.description && (
                      <p className="text-xs text-white/90 line-clamp-2">{credential.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills/Interests Section (Optional) */}
        {((profile.skills && profile.skills.length > 0) || (profile.interests && profile.interests.length > 0)) && (
          <section className="mb-8 print:mb-6">
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3 print:text-lg">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 print:px-3 print:py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 print:text-lg">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 print:px-3 print:py-1">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-600 print:hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#ff4c2b] text-white">
            <IconBolt className="h-3 w-3" />
          </div>
          <span className="font-bold text-gray-900">myreliq</span>
        </div>
        <p>Powered by Myreliq - Proof-of-Work Portfolios</p>
        <a href="/" className="text-[#ff4c2b] hover:underline font-medium mt-2 inline-block">
          Create Your Own Portfolio
        </a>
      </footer>
    </div>
  );
}
