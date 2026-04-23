import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizeApiError(error, fallbackMessage) {
  if (!axios.isAxiosError(error)) {
    return new ApiError(fallbackMessage, 500);
  }

  const status = error.response?.status ?? 500;
  const detail = error.response?.data?.detail;

  if (!error.response) {
    return new ApiError(
      "Cannot reach backend API. Make sure Django is running on http://127.0.0.1:8000 and CORS is configured.",
      0,
    );
  }

  if (status === 503) {
    return new ApiError(
      "AI analysis is temporarily unavailable after 3 retry attempts. Please try again in a minute.",
      status,
    );
  }

  if (typeof detail === "string" && detail.trim()) {
    return new ApiError(detail, status);
  }

  return new ApiError(fallbackMessage, status);
}

export async function analyzeScope(scopeText) {
  try {
    const { data } = await apiClient.post("/analyze/", { scope_text: scopeText });
    return data;
  } catch (error) {
    throw normalizeApiError(error, "Analysis failed. Please try again.");
  }
}

const exportPathMap = {
  wbs: {
    pdf: "/analyze/export/wbs-pdf/",
    png: "/analyze/export/wbs-png/",
  },
  gantt: {
    pdf: "/analyze/export/gantt-pdf/",
    png: "/analyze/export/gantt-png/",
  },
  risk: {
    pdf: "/analyze/export/risk-pdf/",
    png: "/analyze/export/risk-png/",
  },
};

export async function exportAnalysisAsset(kind, format, payload) {
  const path = exportPathMap[kind]?.[format];
  if (!path) {
    throw new Error("Unsupported export request.");
  }

  try {
    const { data } = await apiClient.post(path, payload, {
      responseType: "blob",
    });
    return data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to export analysis asset.");
  }
}
