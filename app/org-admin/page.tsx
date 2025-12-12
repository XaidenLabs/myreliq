import { GhostButton, PrimaryButton } from "@/components/ui/Buttons";
import { requireRole } from "@/lib/auth-guards";

const ProgramCard = ({
  name,
  members,
  status,
}: {
  name: string;
  members: number;
  status: string;
}) => (
  <div className="rounded-2xl border border-[#1f1e2a]/10 bg-white px-5 py-4 shadow-sm">
    <p className="text-sm uppercase tracking-[0.3em] text-[#7d7b8a]">{status}</p>
    <h3 className="mt-1 text-lg font-semibold">{name}</h3>
    <p className="text-sm text-[#5d5b66]">{members} active learners</p>
    <div className="mt-3 flex gap-3">
      <GhostButton label="Manage" className="text-xs" />
      <PrimaryButton label="Issue credential" className="text-xs px-4 py-2" />
    </div>
  </div>
);

export default async function OrganizationAdminPage() {
  await requireRole(["ADMIN", "SUPERADMIN"]);
  return (
    <div className="bg-[#f2f6f5] text-[#10201c]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#22a681]">Org Admin</p>
            <h1 className="mt-2 text-3xl font-semibold">Catalent Fellows HQ</h1>
            <p className="text-sm text-[#4c7062]">
              Manage cohorts, members, and credentials for your community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GhostButton label="Back to admin" href="/admin" />
            <PrimaryButton label="Invite member" />
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#0f2e23]/10 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#4c7062]">Members</p>
            <p className="mt-2 text-3xl font-semibold">128</p>
            <p className="text-sm text-[#4c7062]">Students + mentors linked to Catalent</p>
          </div>
          <div className="rounded-2xl border border-[#0f2e23]/10 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#4c7062]">Credentials issued</p>
            <p className="mt-2 text-3xl font-semibold">86</p>
            <p className="text-sm text-[#4c7062]">Across 4 programs • 2 pending batches</p>
          </div>
        </section>

        <section className="rounded-3xl border border-[#0f2e23]/10 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Cohorts & Programs</h2>
              <p className="text-sm text-[#4c7062]">
                Issue verifiable credentials once milestones are met.
              </p>
            </div>
            <PrimaryButton label="Create cohort" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ProgramCard name="Solana Residency 03" members={28} status="In progress" />
            <ProgramCard name="Product Storytellers 01" members={21} status="Issuing" />
            <ProgramCard name="Frontend Bootcamp 06" members={42} status="Active" />
            <ProgramCard name="Research Sprint 04" members={17} status="Completed" />
          </div>
        </section>

        <section className="rounded-3xl border border-[#0f2e23]/10 bg-white px-6 py-6 shadow-sm">
          <h2 className="text-xl font-semibold">Mentor endorsements</h2>
          <p className="text-sm text-[#4c7062]">Verify or flag endorsements tied to your cohorts.</p>
          <div className="mt-4 space-y-3">
            {[
              {
                mentor: "Ada N.",
                student: "Kwame Ofori",
                comment: "Owned the DAO tooling redesign with weekly demos.",
                rating: 5,
              },
              {
                mentor: "David M.",
                student: "Aisha Bello",
                comment: "Closed onboarding gaps and ran two user tests in week 2.",
                rating: 4,
              },
            ].map((endorsement) => (
              <div
                key={`${endorsement.mentor}-${endorsement.student}`}
                className="rounded-2xl border border-[#0f2e23]/10 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {endorsement.mentor} → {endorsement.student}
                  </p>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#22a681]">
                    {endorsement.rating}/5
                  </span>
                </div>
                <p className="text-sm text-[#4c7062]">{endorsement.comment}</p>
                <div className="mt-2 flex gap-3">
                  <GhostButton label="Verify" className="text-xs" />
                  <GhostButton label="Flag" className="text-xs" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
