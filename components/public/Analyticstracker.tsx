"use client";

import { useEffect } from "react";
import BACKEND_URL from "@/lib/api";

export default function AnalyticsTracker() {
  useEffect(() => {
    fetch(`${BACKEND_URL}/analytics/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname }),
    }).catch(() => {}); // fail silently — never break the UI
  }, []);

  return null; // renders nothing
}
