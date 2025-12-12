import { create } from "zustand";
import type { Profile, User } from "@/lib/types";

type ProfileForm = {
  email: string;
  name: string;
  bio: string;
  education: string;
  interests: string;
  skills: string;
  availability: "internship" | "full-time" | "contract" | "open";
};

type IdentityForm = {
  label: string;
  description: string;
};

type RoleForm = {
  skillId: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  workMode: "remote" | "on-site" | "hybrid";
  description: string;
  tags: string;
  links: string;
};

type MilestoneForm = {
  roleId: string;
  title: string;
  description: string;
  date: string;
  metrics: string;
  mediaUrl: string;
};

type BuilderState = {
  profile: Profile | null;
  profileForm: ProfileForm;
  identityForm: IdentityForm;
  roleForm: RoleForm;
  milestoneForm: MilestoneForm;
  loading: boolean;
  error: string | null;
  user: User | null;
  fetchUser: () => Promise<void>;
  shareBaseUrl: string;
  setShareBaseUrl: (url: string) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  updateProfileForm: (values: Partial<ProfileForm>) => void;
  updateIdentityForm: (values: Partial<IdentityForm>) => void;
  updateRoleForm: (values: Partial<RoleForm>) => void;
  updateMilestoneForm: (values: Partial<MilestoneForm>) => void;
  resetIdentityForm: () => void;
  resetRoleForm: () => void;
  resetMilestoneForm: () => void;
};

const initialProfileForm: ProfileForm = {
  email: "",
  name: "",
  bio: "",
  education: "",
  interests: "",
  skills: "",
  availability: "open",
};

const initialIdentityForm: IdentityForm = {
  label: "",
  description: "",
};

const initialRoleForm: RoleForm = {
  skillId: "",
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  workMode: "remote",
  description: "",
  tags: "",
  links: "",
};

const initialMilestoneForm: MilestoneForm = {
  roleId: "",
  title: "",
  description: "",
  date: "",
  metrics: "",
  mediaUrl: "",
};

export const useBuilderStore = create<BuilderState>((set) => ({
  profile: null,
  profileForm: initialProfileForm,
  identityForm: initialIdentityForm,
  roleForm: initialRoleForm,
  milestoneForm: initialMilestoneForm,
  loading: false,
  error: null,
  // User Auth State
  user: null,
  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const { data } = await res.json();
        set({ user: data });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      set({ user: null });
    }
  },

  shareBaseUrl: "",
  setShareBaseUrl: (url) => set({ shareBaseUrl: url }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateProfileForm: (values) =>
    set((state) => ({ profileForm: { ...state.profileForm, ...values } })),
  updateIdentityForm: (values) =>
    set((state) => ({ identityForm: { ...state.identityForm, ...values } })),
  updateRoleForm: (values) =>
    set((state) => ({ roleForm: { ...state.roleForm, ...values } })),
  updateMilestoneForm: (values) =>
    set((state) => ({ milestoneForm: { ...state.milestoneForm, ...values } })),
  resetIdentityForm: () => set({ identityForm: initialIdentityForm }),
  resetRoleForm: () => set({ roleForm: initialRoleForm }),
  resetMilestoneForm: () => set({ milestoneForm: initialMilestoneForm }),
}));
