"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  siteName: string;
  displayName: string;
  role: string;
  bio: string;
  available: boolean;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

const defaultSettings: SiteSettings = {
  siteName: "OD.DEV",
  displayName: "Ogunwe Debo",
  role: "Full Stack Developer",
  bio: "I build fast, scalable, production-ready web applications.",
  available: true,
  email: "ogunweoluwadebo@gmail.com",
  github: "",
  linkedin: "",
  twitter: "",
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/settings`)
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {}) // fallback to defaults silently
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
