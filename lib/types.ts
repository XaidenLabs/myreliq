export type Availability = "internship" | "full-time" | "contract" | "open";
export type WorkMode = "remote" | "on-site" | "hybrid";
export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  username?: string;
  walletAddress?: string;
  emailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  userId: string;
  fullName: string;
  headline?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  shareSlug: string;
  mintAddress?: string;
  completionScore: number;
  education: {
    school: string;
    degree: string;
    startDate?: string;
    endDate?: string;
  }[];
  socials: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
    youtube?: string;
  };
  interests: string[];
  skills: string[];
  tools: {
    name: string;
    proficiency: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type Identity = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  profileImage?: string;
  isPrimary: boolean;
  mintAddress?: string;
  metadataUri?: string;
  createdAt: string;
  updatedAt: string;
};

export type Role = {
  id: string;
  userId: string;
  identityId: string;
  title: string;
  organization: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date
  workMode: WorkMode;
  description?: string;
  tags: string[];
  links: { label: string; url: string }[];
  visibility: "public" | "private" | "link-only";
  createdAt: string;
  updatedAt: string;
};

export type Milestone = {
  id: string;
  userId: string;
  roleId: string;
  title: string;
  description?: string;
  date: string; // ISO date
  metrics?: string;
  mediaUrl?: string;
  links: { label: string; url: string }[];
  createdAt: string;
  updatedAt: string;
};

export type CredentialStatus = "pending" | "minted" | "revoked";

export type Credential = {
  id: string;
  userId: string;
  organizationId?: string; // If issued by an org
  roleId?: string; // If linked to a role
  milestoneId?: string; // If linked to a milestone
  title: string;
  description?: string;
  metadataUri: string;
  mintAddress?: string;
  status: CredentialStatus;
  mintedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioVersion = {
  id: string;
  userId: string;
  version: number;
  data: any; // Full JSON dump
  metadataHash: string;
  txId?: string;
  isPublic: boolean;
  publishedAt?: string;
  createdAt: string;
};
