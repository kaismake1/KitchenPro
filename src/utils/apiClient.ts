/**
 * Centralized API Client
 * Handles all HTTP requests to FastAPI backend
 */

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

const API_BASE_URL = "http://localhost:8000/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  }

  private async handleResponse(response: Response): Promise<any> {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.detail || data?.message || "Request failed",
        details: data,
      } as ApiError;
    }

    return data;
  }

  async get(endpoint: string, options?: RequestInit): Promise<any> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "GET",
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      throw {
        status: 0,
        message: `Network error: ${error instanceof Error ? error.message : "Failed to fetch"}`,
        details: error,
      } as ApiError;
    }
  }

  async post(
    endpoint: string,
    body?: any,
    options?: RequestInit,
  ): Promise<any> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      return this.handleResponse(response);
    } catch (error) {
      throw {
        status: 0,
        message: `Network error: ${error instanceof Error ? error.message : "Failed to fetch"}`,
        details: error,
      } as ApiError;
    }
  }

  async patch(
    endpoint: string,
    body?: any,
    options?: RequestInit,
  ): Promise<any> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "PATCH",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse(response);
  }

  async delete(endpoint: string, options?: RequestInit): Promise<any> {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers,
    });

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
