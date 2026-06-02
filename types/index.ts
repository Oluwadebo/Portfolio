// ─── Project ────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectInput = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

// ─── Auth ────────────────────────────────────────────
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// ─── Analytics ──────────────────────────────────────
export interface AnalyticsData {
  totalVisits: number;
  recentVisits: number;
  dailyVisits: { createdAt: string; _count: number }[];
  projectClicks: {
    projectId: string;
    type: "LIVE" | "GITHUB";
    _count: number;
  }[];
  projects: { id: string; title: string }[];
}

// ─── API Response wrapper ────────────────────────────
export interface ApiError {
  error: string;
}

// ─── URL Preview ─────────────────────────────────────
export interface URLPreview {
  image: string | null;
  title: string | null;
  description: string | null;
  source: "og" | "microlink" | "none";
}
