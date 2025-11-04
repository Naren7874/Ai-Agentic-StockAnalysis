import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Base URL for your API.
// Make sure this is correct for your environment.
const API_BASE = "http://localhost:8000/api/";

const AuthContext = createContext();

/**
 * Custom hook to easily access the AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Provides authentication state and functions to the entire app.
 * Manages user state, loading, API calls, and token interceptors.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Create an Axios instance that will be used for authenticated requests. // This instance has interceptors configured.

  const api = axios.create({ baseURL: API_BASE }); // --- Axios Interceptors --- // Request interceptor: Automatically adds the Authorization header

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }); // Response interceptor: Handles 401 errors by attempting to refresh the token

  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const originalRequest = error.config; // Check if it's a 401 error and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark as retried
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            // Attempt to get a new access token using the refresh token
            const response = await axios.post(`${API_BASE}token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem("access_token", newAccessToken); // Update the original request's header and retry it
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout(); // Logout user if refresh fails
          }
        } else {
          // No refresh token available, logout
          logout();
        }
      } // For any other errors, just reject the promise
      return Promise.reject(error);
    }
  ); // --- Auth Functions ---
  /**
   * Fetches the user's profile from the API using the 'api' instance
   * (which has the auth header).
   */

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("user/"); // Endpoint for fetching user profile
      setUser(data);
    } catch (err) {
      console.error("Profile fetch failed:", err); // If profile fetch fails (e.g., invalid token), clear tokens
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } finally {
      // Always set loading to false after attempting to fetch
      setLoading(false);
    }
  }; // On component mount, check for existing token and fetch profile
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      // No token, so we're not logged in. Stop loading.
      setLoading(false);
    }
  }, []);
  /**
   * Logs the user in.
   * @param {object} credentials - User credentials (e.g., { email, password })
   * @returns {object} - { success: boolean, error?: string }
   */

  const login = async (credentials) => {
    try {
      // Use plain axios for login, as interceptors aren't needed
      const { data } = await axios.post(`${API_BASE}login/`, credentials); // Handle various possible token response structures
      const accessToken =
        data.access || data.tokens?.access || data.access_token;
      const refreshToken =
        data.refresh || data.tokens?.refresh || data.refresh_token;
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response: tokens not found");
      }
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken); // After successful login, fetch the user's profile
      await fetchProfile();
      return { success: true };
    } catch (err) {
      console.error("Login error:", err.response?.data || err); // Extract a user-friendly error message
      const errorMessage =
        err.response?.data?.detail ||
        (err.response?.data?.non_field_errors &&
          err.response.data.non_field_errors[0]) ||
        err.message ||
        "Login failed";
      return { success: false, error: errorMessage };
    }
  };
  /**
   * Registers a new user.
   * @param {object} userData - New user data (e.g., { email, username, password })
   * @returns {object} - { success: boolean, error?: string }
   */

  const register = async (userData) => {
  try {
    // Normalize password fields to what the backend expects
    // Backend expects: password1 and password2
    const payload = {
      email: userData.email,
      username: userData.username,
      // prefer explicit password1/password2 when provided (e.g. Register component),
      // otherwise map single `password` to both fields so SignUp component continues to work.
      password1:
        userData.password1 ??
        userData.password ??
        userData.passwordMain ??
        '',
      password2:
        userData.password2 ??
        userData.passwordConfirm ??
        userData.password ??
        '',
      // include other optional fields if present
      ...(typeof userData.is_trader !== 'undefined' && { is_trader: userData.is_trader }),
    };

    // Defensive: ensure both password fields are present
    if (!payload.password1 || !payload.password2) {
      return { success: false, error: 'Both password fields are required.' };
    }

    // Use plain axios for registration
    const { data } = await axios.post(`${API_BASE}register/`, payload);

    // Handle various possible token response structures
    const accessToken =
      data.access || data.tokens?.access || data.access_token;
    const refreshToken =
      data.refresh || data.tokens?.refresh || data.refresh_token;
    if (!accessToken || !refreshToken) {
      throw new Error("Invalid response: tokens not found");
    }
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    // After successful registration, fetch the user's profile
    await fetchProfile();
    return { success: true };
  } catch (err) {
    console.error("Register error:", err.response?.data || err);

    const errorData = err.response?.data;
    let errorMessage = "Registration failed";
    if (errorData) {
      // If backend returns field errors, build a readable message
      if (typeof errorData === 'object') {
        // common DRF format: { field: [ "msg" ] }
        const fieldMsgs = [];
        for (const [key, val] of Object.entries(errorData)) {
          if (Array.isArray(val)) fieldMsgs.push(`${key}: ${val.join(' ')}`);
          else fieldMsgs.push(`${key}: ${String(val)}`);
        }
        if (fieldMsgs.length) errorMessage = fieldMsgs.join(' | ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    return { success: false, error: errorMessage };
  }
};

  /**
   * Logs the user out.
   * Clears local storage and user state.
   * Optionally calls a logout endpoint on the API.
   */

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        // Inform the backend about the logout (e.g., to blacklist the token)
        await api.post("logout/", { refresh: refreshToken });
      } catch (err) {
        // Don't block logout if API call fails; just log it.
        console.error("Logout API error (non-critical):", err);
      }
    } // Always clear client-side data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }; // --- Context Value --- // The value provided to all consuming components

  const value = {
    user,
    login,
    register,
    logout,
    loading, // Consumers can check this to show a loading spinner
    api, // Expose the configured Axios instance
  };

  return (
    <AuthContext.Provider value={value}>
            {children}   {" "}
    </AuthContext.Provider>
  );
};

// Default export for convenience, although named exports are also provided
export default AuthProvider;
