"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconBolt, IconMilestone, IconRoles, IconShare, IconSpark } from "@/components/icons";
import { Identity, Role, Milestone } from "@/lib/types";
import { CreateIdentityModal } from "@/components/modals/CreateIdentityModal";
import { CreateRoleModal } from "@/components/modals/CreateRoleModal";
import { AddMilestoneModal } from "@/components/modals/AddMilestoneModal";
import { AddCredentialModal } from "@/components/modals/AddCredentialModal";
import { CredentialsSection } from "@/components/dashboard/CredentialsSection";
import { MintIdentityButton } from "@/components/dashboard/MintIdentityButton";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";

// Placeholder components for sections - normally these would be in separate files
const OverviewSection = ({ identities, roles, milestones, shareSlug }: { identities: Identity[], roles: Role[], milestones: Milestone[], shareSlug?: string }) => {
  const stats = [
    { label: "Identities", value: identities.length, icon: IconSpark },
    { label: "Roles", value: roles.length, icon: IconRoles },
    { label: "Milestones", value: milestones.length, icon: IconMilestone },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-[#1f1e2a]/5 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#fef7f5] transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef7f5] text-[#ff4c2b]">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7b8a]">{stat.label}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-[#1f1e2a]">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-[#1f1e2a]/5">
        <h2 className="text-2xl font-bold text-[#1f1e2a]">Public Profile</h2>
        <p className="mt-2 text-[#5d5b66]">Your public portfolio is {shareSlug ? "active" : "not set up"}.</p>
        {shareSlug && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-between">
            <code className="text-sm font-semibold text-[#5d5b66]">myreliq.com/portfolio/{shareSlug}</code>
            <a href={`/portfolio/${shareSlug}`} target="_blank" className="text-sm font-bold text-[#ff4c2b] hover:underline">View Live</a>
          </div>
        )}
      </section>
    </div>
  );
};

const PortfolioSection = ({
  identities,
  roles,
  milestones,
  onAddIdentity,
  onAddRole,
  onAddMilestone,
  shareSlug
}: {
  identities: Identity[],
  roles: Role[],
  milestones: Milestone[],
  onAddIdentity: () => void,
  onAddRole: () => void,
  onAddMilestone: (roleId?: string) => void,
  shareSlug?: string
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#1f1e2a]">My Identities</h2>
        <button
          onClick={onAddIdentity}
          className="px-4 py-2 bg-[#ff4c2b] text-white rounded-full text-sm font-bold hover:bg-[#e64426] transition shadow-lg shadow-[#ff4c2b]/20"
        >
          + New Identity
        </button>
      </div>

      {identities.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
          <p className="text-[#5d5b66] mb-4">No identities yet. Create your first persona (e.g., "Product Designer") to start.</p>
          <button
            onClick={onAddIdentity}
            className="text-[#ff4c2b] font-bold hover:underline"
          >
            Create Identity
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {identities.map((identity) => (
            <div key={identity.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#1f1e2a]/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1f1e2a] flex items-center gap-2">
                    <IconSpark className="h-4 w-4 text-[#ff4c2b]" />
                    {identity.name}
                  </h3>
                  <p className="text-sm text-[#5d5b66] mt-1">{identity.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {shareSlug && (
                    <a
                      href={`/portfolio/${shareSlug}/${identity.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-[#5d5b66] bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                    >
                      View Public
                    </a>
                  )}
                  <MintIdentityButton
                    identity={identity}
                    roles={roles}
                    milestones={milestones}
                  />
                  <button
                    onClick={onAddRole} // Could pass identityId pre-selection
                    className="text-xs font-bold text-[#ff4c2b] bg-[#fef7f5] px-3 py-1.5 rounded-lg hover:bg-[#ffece8]"
                  >
                    + Role
                  </button>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-gray-100 space-y-4">
                {roles.filter(r => r.identityId === identity.id).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No roles added yet.</p>
                )}
                {roles.filter(r => r.identityId === identity.id).map(role => (
                  <div key={role.id} className="bg-gray-50 p-4 rounded-xl group relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#1f1e2a]">{role.title}</p>
                        <p className="text-xs text-[#5d5b66] uppercase tracking-wider">{role.organization}</p>
                      </div>
                    </div>

                    {/* Milestones for role */}
                    <div className="mt-3 space-y-2">
                      {milestones.filter(m => m.roleId === role.id).map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-2 text-xs text-[#5d5b66] bg-white p-2 rounded-lg border border-gray-100">
                          <IconMilestone className="h-3 w-3 text-[#ff4c2b]" />
                          <span>{milestone.title}</span>
                        </div>
                      ))}
                      <button
                        onClick={() => onAddMilestone(role.id)}
                        className="text-[10px] font-bold text-[#ff4c2b] hover:underline flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        + Add Milestone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const { user, fetchUser, loading: authLoading } = useAuthStore();
  const {
    profile,
    identities,
    roles,
    milestones,
    credentials,
    activeTab,
    setActiveTab,
    reloadDashboardData,
    isLoading: dashboardLoading
  } = useDashboardStore();

  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    // Restore session if needed
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    // Redirect if not authenticated after loading
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    // Initial data load only if user is present
    if (user) {
      reloadDashboardData();
    }
  }, [reloadDashboardData, user]);

  if (authLoading || (user && dashboardLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef7f5] text-[#1f1e2a] font-bold">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <IconBolt className="h-8 w-8 text-[#ff4c2b] animate-spin" />
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!user) return null; // Will redirect via effect

  return (
    <div className="min-h-screen bg-[#fef7f5] text-[#1f1e2a] flex">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col justify-between border-r border-[#1f1e2a]/5 bg-white px-6 py-8 md:flex fixed h-full z-10">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4c2b] text-white shadow-lg shadow-[#ff4c2b]/20">
              <IconBolt className="h-6 w-6" />
            </div>
            <a href="/">
              <p className="text-xl font-bold tracking-tight">myreliq</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4c2b]">Dashboard</p>
            </a>
          </div>
          <nav className="flex flex-col gap-2 font-medium text-base">
            {["overview", "portfolio", "settings", "credentials"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 capitalize ${activeTab === tab
                  ? "bg-[#1f1e2a] text-white shadow-lg shadow-[#1f1e2a]/10"
                  : "text-[#5d5b66] hover:bg-[#ffece8] hover:text-[#ff4c2b]"
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${activeTab === tab ? "bg-[#ff4c2b]" : "bg-transparent group-hover:bg-[#ff4c2b]/50"}`}></span>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-2">
          {/* User Mini Profile */}
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[#5d5b66]">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName || "User"}</p>
              <p className="text-xs text-[#5d5b66] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 transition-all duration-500">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 bg-white/80 px-6 py-5 backdrop-blur-xl md:px-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a] capitalize">
              {activeTab}
            </h1>
          </div>
          <div className="flex gap-4">
            {/* Dynamic Header Actions based on Tab */}
            {activeTab === 'portfolio' && (
              <a
                href={profile?.shareSlug ? `/portfolio/${profile.shareSlug}` : '#'}
                target="_blank"
                className="hidden sm:flex items-center justify-center rounded-full border border-[#1f1e2a]/10 px-6 py-2.5 text-sm font-bold text-[#5d5b66] hover:bg-white transition"
              >
                View Public
              </a>
            )}
          </div>
        </header>

        <main className="px-6 py-8 md:px-10 max-w-7xl mx-auto">
          {dashboardLoading && <div className="text-center py-10">Loading dashboard...</div>}

          {!dashboardLoading && activeTab === "overview" && (
            <OverviewSection
              identities={identities}
              roles={roles}
              milestones={milestones}
              shareSlug={profile?.shareSlug}
            />
          )}

          {!dashboardLoading && activeTab === "portfolio" && (
            <PortfolioSection
              identities={identities}
              roles={roles}
              milestones={milestones}
              shareSlug={profile?.shareSlug}
              onAddIdentity={() => setShowIdentityModal(true)}
              onAddRole={() => setShowRoleModal(true)}
              onAddMilestone={(roleId) => {
                setSelectedRoleId(roleId);
                setShowMilestoneModal(true);
              }}
            />
          )}

          {!dashboardLoading && activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-[2rem] border border-[#1f1e2a]/5">
                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                <p className="text-[#5d5b66] mb-8">Edit your personal details, bio, and social links here.</p>
                <ProfileSettingsForm />
              </div>
            </div>
          )}

          {!dashboardLoading && activeTab === "credentials" && (
            <CredentialsSection
              credentials={credentials}
              onAddCredential={() => setShowCredentialModal(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateIdentityModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
      />
      <CreateRoleModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        identities={identities}
      />
      <AddMilestoneModal
        isOpen={showMilestoneModal}
        onClose={() => {
          setShowMilestoneModal(false);
          setSelectedRoleId(undefined);
        }}
        roles={roles}
        preselectedRoleId={selectedRoleId}
      />
      <AddCredentialModal
        isOpen={showCredentialModal}
        onClose={() => setShowCredentialModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
