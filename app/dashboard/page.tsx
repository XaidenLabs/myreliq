"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconBolt, IconMilestone, IconRoles, IconShare, IconSpark, IconMenu, IconGraph } from "@/components/icons";
import { toast } from "sonner";
import { Identity, Role, Milestone } from "@/lib/types";
import { CreateIdentityModal } from "@/components/modals/CreateIdentityModal";
import { CreateRoleModal } from "@/components/modals/CreateRoleModal";
import { AddMilestoneModal } from "@/components/modals/AddMilestoneModal";
import { AddCredentialModal } from "@/components/modals/AddCredentialModal";
import { CredentialsSection } from "@/components/dashboard/CredentialsSection";
import { IdentitiesSection } from "@/components/dashboard/IdentitiesSection";
import { CertificationsSection } from "@/components/dashboard/CertificationsSection";
import { MintIdentityButton } from "@/components/dashboard/MintIdentityButton";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";
import { ProfileOnboardingModal } from "@/components/modals/ProfileOnboardingModal";
import { ToolsProficiencySection } from "@/components/dashboard/ToolsProficiencySection";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";


// Placeholder components for sections - normally these would be in separate files
const OverviewSection = ({
  identities,
  roles,
  milestones,
  shareSlug,
  onCompleteProfile
}: {
  identities: Identity[],
  roles: Role[],
  milestones: Milestone[],
  shareSlug?: string,
  onCompleteProfile: () => void
}) => {
  const stats = [
    { label: "Identities", value: identities.length, icon: IconSpark },
    { label: "Roles", value: roles.length, icon: IconRoles },
    { label: "Milestones", value: milestones.length, icon: IconMilestone },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#2a2935] p-6 shadow-sm border border-[#1f1e2a]/5 dark:border-white/5 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#fef7f5] dark:bg-white/5 transition-transform group-hover:scale-110"></div>
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef7f5] dark:bg-white/10 text-[#ff4c2b]">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7b8a] dark:text-gray-400">{stat.label}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] bg-white dark:bg-[#2a2935] p-8 shadow-sm border border-[#1f1e2a]/5 dark:border-white/5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconShare className="h-5 w-5 text-[#ff4c2b]" />
              <h2 className="text-2xl font-bold text-[#1f1e2a] dark:text-white">Public Profile</h2>
            </div>
            <p className="text-sm text-[#5d5b66] dark:text-gray-400">
              {shareSlug ? "Your portfolio is live and ready to share" : "Set up your portfolio to share with others"}
            </p>
          </div>
          {shareSlug && (
            <a
              href={`/portfolio/${shareSlug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff4c2b] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/20 hover:bg-[#e64426] transition"
            >
              View Live
            </a>
          )}
        </div>

        {shareSlug && (
          <div className="relative">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#fef7f5] to-[#ffece8] dark:from-[#3a3945] dark:to-[#2a2935] rounded-2xl border border-[#ff4c2b]/10">
              <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0 p-2 bg-white dark:bg-[#1f1e2a] rounded-lg border border-[#1f1e2a]/5 dark:border-white/5">
                  <IconBolt className="h-4 w-4 text-[#ff4c2b]" />
                </div>
                <code className="text-sm font-bold text-[#1f1e2a] dark:text-white truncate">
                  myreliq.com/portfolio/{shareSlug}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/portfolio/${shareSlug}`);
                  toast.success('Link copied to clipboard!');
                }}
                className="flex-shrink-0 px-4 py-2 bg-white dark:bg-[#1f1e2a] text-[#ff4c2b] rounded-lg text-xs font-bold border border-[#ff4c2b]/20 hover:bg-[#ff4c2b] hover:text-white transition shadow-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {!shareSlug && (
          <div className="mt-4 p-6 bg-[#fef7f5] rounded-2xl border border-dashed border-[#ff4c2b]/20 text-center">
            <p className="text-sm text-[#5d5b66] mb-3">Complete your profile settings to activate your public portfolio link</p>
            <button
              onClick={onCompleteProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff4c2b] text-white rounded-xl text-sm font-bold hover:bg-[#e64426] transition shadow-lg shadow-[#ff4c2b]/20"
            >
              Complete Profile
            </button>
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
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Premium Gating Logic
  const handleAddIdentity = () => {
    setShowIdentityModal(true);
  };

  const handleAddCredential = () => {
    setShowCredentialModal(true);
  };

  // Note: Milestones are usually added per role. We need to check TOTAL milestones across all roles?
  // The user said "add only one milestone". This implies strict limit.
  // Implementation assumes we need to intercept the triggering of AddMilestoneModal.
  // Since AddMilestoneModal is likely triggered from within IdentityDetailsModal (if that's where roles are),
  // we might need to pass this handler down.
  // For now, let's define it.
  const handleAddMilestone = (roleId?: string) => {
    setSelectedRoleId(roleId);
    setShowMilestoneModal(true);
  };


  const handleAddRole = () => {
    setShowRoleModal(true);
  };

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

  useEffect(() => {
    // Show modal if profile is missing (new user) or has missing critical details
    if (!dashboardLoading && (!profile || !profile.fullName || !profile.profileImage || !profile.shareSlug || profile.fullName.trim() === "")) {
      setShowOnboardingModal(true);
    }
  }, [profile, dashboardLoading]);

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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform flex-col justify-between bg-[#e5e7eb] dark:bg-[#121212] px-6 py-8 transition-transform duration-300 md:translate-x-0 md:static md:flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3 px-2">
            <IconBolt className="h-8 w-8 text-[#ff4c2b]" />
            <div>
              <p className="text-xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">My Reliq</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4c2b]">DASHBOARD</p>
            </div>
          </div>

          <nav className="flex flex-col gap-4 font-bold text-base">
            <button
              onClick={() => {
                setActiveTab("portfolio");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${activeTab === "portfolio"
                ? "bg-[#1f1e2a] dark:bg-white text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20"
                : "text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === "portfolio" ? "bg-[#ff4c2b]" : "bg-transparent"}`}></span>
              My Portfolio
            </button>

            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${activeTab === "overview"
                ? "bg-[#1f1e2a] dark:bg-white text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20"
                : "text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === "overview" ? "bg-[#ff4c2b]" : "bg-transparent"}`}></span>
              My Identities
            </button>

            <button
              onClick={() => {
                setActiveTab("credentials");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${activeTab === "credentials"
                ? "bg-[#1f1e2a] dark:bg-white text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20"
                : "text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === "credentials" ? "bg-[#ff4c2b]" : "bg-transparent"}`}></span>
              Certificates
            </button>

            <button
              onClick={() => {
                setActiveTab("analytics");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${activeTab === "analytics"
                ? "bg-[#1f1e2a] dark:bg-white text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20"
                : "text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === "analytics" ? "bg-[#ff4c2b]" : "bg-transparent"}`}></span>
              Analytics
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 ${activeTab === "settings"
                ? "bg-[#1f1e2a] dark:bg-white text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20"
                : "text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === "settings" ? "bg-[#ff4c2b]" : "bg-transparent"}`}></span>
              My Details
            </button>


            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <a
                href="/admin"
                className="group flex items-center gap-3 rounded-full px-6 py-3 text-[#5d5b66] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                Admin Panel
              </a>
            )}
          </nav>
        </div>

        <div className="px-2">
          {/* User Mini Profile */}
          <div className="flex items-center gap-3 mb-6 p-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center font-bold text-[#5d5b66]">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName || "User"}</p>
              <p className="text-xs text-[#5d5b66] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="w-full rounded-xl bg-white p-3 text-xs font-bold text-[#5d5b66] transition hover:bg-red-50 hover:text-red-500"
          >
            Sign Out
          </button>
        </div>
      </aside >

      {/* Main Content */}
      < div className="flex-1 transition-all duration-500 bg-[#fef7f5] dark:bg-[#1f1e2a] overflow-y-auto h-screen" >
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-8 md:px-12 bg-[#fef7f5]/80 dark:bg-[#1f1e2a]/80 backdrop-blur-sm">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-[#1f1e2a] dark:text-white">
              <IconMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <a
              href="/"
              target=""
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2a2935] text-[#1f1e2a] dark:text-white rounded-full text-sm font-bold shadow-sm border border-[#1f1e2a]/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Visit Site
              <IconShare className="h-4 w-4" />
            </a>
            <ThemeToggle />
          </div>
        </header>

        <main className="px-6 md:px-12 max-w-6xl pb-20">
          {dashboardLoading && <div className="text-center py-10 dark:text-white">Loading dashboard...</div>}

          {!dashboardLoading && activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <IdentitiesSection onAddIdentityOverride={handleAddIdentity} />
            </div>
          )}

          {!dashboardLoading && activeTab === "portfolio" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1f1e2a] dark:text-white">My Portfolio Structure</h2>
                <p className="text-[#5d5b66] dark:text-gray-400">Manage how your portfolio looks and feels.</p>
              </div>
              <OverviewSection
                identities={identities}
                roles={roles}
                milestones={milestones}
                shareSlug={profile?.shareSlug}
                onCompleteProfile={() => setShowOnboardingModal(true)}
              />
              <div className="pt-8 border-t border-[#1f1e2a]/5 dark:border-white/5">
                <PortfolioSection
                  identities={identities}
                  roles={roles}
                  milestones={milestones}
                  onAddIdentity={handleAddIdentity}
                  onAddRole={handleAddRole}
                  onAddMilestone={handleAddMilestone}
                  shareSlug={profile?.shareSlug}
                />
              </div>
            </div>
          )}

          {!dashboardLoading && activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-[#2a2935] p-8 md:p-12 rounded-[2.5rem] border border-[#1f1e2a]/5 dark:border-white/5">
                <h3 className="text-xl font-bold mb-8 dark:text-white">Personal Information</h3>
                <ProfileSettingsForm />
              </div>
            </div>
          )}

          {!dashboardLoading && activeTab === "tools" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ToolsProficiencySection />
            </div>
          )}

          {!dashboardLoading && activeTab === "certifications" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CertificationsSection onAddOverride={handleAddCredential} />
            </div>
          )}

          {!dashboardLoading && activeTab === "credentials" && (
            <CredentialsSection
              credentials={credentials}
              onAddCredential={handleAddCredential}
            />
          )}

          {!dashboardLoading && activeTab === "analytics" && (
            <AnalyticsSection />
          )}
        </main>
      </div >

      {/* Modals */}
      < CreateIdentityModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
      />
      < CreateRoleModal
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
      <ProfileOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />

    </div>
  );
};

export default DashboardPage;
