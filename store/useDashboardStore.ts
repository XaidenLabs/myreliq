import { create } from "zustand";
import { Identity, Role, Milestone, Credential, Profile } from "@/lib/types";

interface DashboardState {
  profile: Profile | null;
  identities: Identity[];
  roles: Role[];
  milestones: Milestone[];
  credentials: Credential[];

  activeTab:
    | "overview"
    | "portfolio"
    | "settings"
    | "credentials"
    | "certifications"
    | "tools";
  isLoading: boolean;
  error: string | null;

  setActiveTab: (tab: DashboardState["activeTab"]) => void;

  // Actions to fetch all data
  reloadDashboardData: () => Promise<void>;

  // Optimistic updates or direct setters
  setIdentities: (identities: Identity[]) => void;
  setRoles: (roles: Role[]) => void;
  setMilestones: (milestones: Milestone[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  identities: [],
  roles: [],
  milestones: [],
  credentials: [],
  activeTab: "portfolio",
  isLoading: true,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIdentities: (identities) => set({ identities }),
  setRoles: (roles) => set({ roles }),
  setMilestones: (milestones) => set({ milestones }),

  reloadDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        profileRes,
        identitiesRes,
        rolesRes,
        milestonesRes,
        credentialsRes,
      ] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/identities"),
        fetch("/api/roles"),
        fetch("/api/milestones?all=true"),
        fetch("/api/credentials"),
      ]);

      const profileData = await profileRes.json();
      const identitiesData = await identitiesRes.json();
      const rolesData = await rolesRes.json();
      const milestonesData = await milestonesRes.json();
      const credentialsData = await credentialsRes.json();

      // Helper to map _id to id
      const mapId = (item: any) => ({ ...item, id: item._id || item.id });

      set({
        profile: profileData.data ? mapId(profileData.data) : null,
        identities: (identitiesData.data || []).map(mapId),
        roles: (rolesData.data || []).map(mapId),
        milestones: (milestonesData.data || []).map(mapId),
        credentials: (credentialsData.data || []).map(mapId),
        isLoading: false,
      });
    } catch (error) {
      console.error("Dashboard sync failed", error);
      set({ error: "Failed to load dashboard data", isLoading: false });
    }
  },
}));
