import type { NodeType } from "@/components/CreateWorkflow";
import type { Edge } from "@xyflow/react";
import axios, { type AxiosInstance, AxiosError } from "axios";

// Types for API responses
interface AuthResponse {
  success: boolean;
  id: string;
  token?: string;
  message?: string;
}

interface WorkflowResponse {
  success: boolean;
  message?: string;
  id?: string;
  workflowId?: string;
  workflow?: Workflow;
  workflows?: Workflow[];
}

interface ExecutionsResponse {
  executions: Execution[];
}

export interface NodesResponse {
  nodes: Node[];
}

// Domain Models
interface User {
  username: string;
  password: string;
}

export interface Workflow {
  _id: string;
  userId: string;
  nodes: NodeType[];
  edges: Edge[];
  createdAt?: string;
  updatedAt?: string;
}

interface Execution {
  _id: string;
  workflowId: string;
  status?: string;
  result?: object;
  createdAt?: string;
}

export interface Node {
  _id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

// Create axios instance
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const signup = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/signup", {
      username,
      password,
    });
    console.log("Signup Response: ", response);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const signin = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/signin", {
      username,
      password,
    });

    // Store token and userId in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
    }

    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Workflow APIs
export const createWorkflow = async (
  nodes: object[],
  edges: object[]
): Promise<WorkflowResponse> => {
  try {
    const response = await api.post<WorkflowResponse>("/workflow", {
      nodes,
      edges,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateWorkflow = async (
  workflowId: string,
  updates: Partial<Workflow>
): Promise<WorkflowResponse> => {
  try {
    const response = await api.put<WorkflowResponse>(
      `/workflow/${workflowId}`,
      updates
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getWorkflow = async (workflowId: string): Promise<Workflow> => {
  try {
    const response = await api.get<WorkflowResponse>(`/workflow/${workflowId}`);
    return response.data.workflow!;
  } catch (error) {
    throw handleError(error);
  }
};

export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    const response = await api.get<WorkflowResponse>("/workflows");
    return response.data.workflows || [];
  } catch (error) {
    throw handleError(error);
  }
};

// Execution APIs
export const getWorkflowExecutions = async (
  workflowId: string
): Promise<Execution[]> => {
  try {
    const response = await api.get<ExecutionsResponse>(
      `/workflow/executions/${workflowId}`
    );
    return response.data.executions;
  } catch (error) {
    throw handleError(error);
  }
};

// Nodes APIs
export const getNodes = async (): Promise<Node[]> => {
  try {
    const response = await api.get<NodesResponse>("/nodes");
    return response.data.nodes;
  } catch (error) {
    throw handleError(error);
  }
};

// Utility function to handle errors
const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return new Error(message);
  }
  return error instanceof Error ? error : new Error("An unknown error occurred");
};

// Utility function to logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/signin";
};

// Utility function to get stored token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Utility function to get stored userId
export const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

export default api;