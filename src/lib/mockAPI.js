import { supabase } from "./supabaseClient";

// constant API_BASE_URL = "https://visualbrief.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getToken = async () => {
  const manualToken = localStorage.getItem("access_token");
  if (manualToken) return manualToken;

  const { data: sessionData } = await supabase.auth.getSession();
  const supabaseToken = sessionData?.session?.access_token;
  if (supabaseToken) return supabaseToken;

  return null;
};

export const apiLayer = {
  async uploadPdf(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileId: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
        });
      }, 2000);
    });
  },

  async getBriefs() {
    const userToken = await getToken();

    if (!userToken) {
      throw new Error("Authentication required. Token not found.");
    }

    const url = `${API_BASE_URL}/api/briefs`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch visual briefs.");
      }

      const data = await response.json();
      const mappedBriefs = data.map((dbBrief) => ({
        id: dbBrief.id,
        fileName: dbBrief.file_name,
        style: dbBrief.brief_type,
        brief: dbBrief.brief_content,
        diagram: dbBrief.diagram_content,
        date: new Date(dbBrief.created_at),
        briefLength: "N/A",
      }));

      return mappedBriefs;
    } catch (error) {
      console.error("Error fetching briefs from backend:", error);
      throw error;
    }
  },

  async getSummary(id) {
    return new Promise((resolve) => {
      const mockSummaries = [];
      const summary = mockSummaries.find((s) => s.id === id);
      setTimeout(() => resolve(summary), 300);
    });
  },

  async generateSummary(fileId, style) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          summary: {
            title: "Generated Summary",
            bullets: ["Key finding 1", "Key finding 2", "Key finding 3"],
            keyQuotes: ["Important quote from document"],
          },
        });
      }, 3000);
    });
  },
};