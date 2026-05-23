import axios from "axios";
import { create } from "zustand";

import { API_BASE_URL } from "../config/api";

const AUTH_USER_KEY = "crowdfund-current-user";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const storeUser = (user) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearStoredUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

const storedUser = getStoredUser();

export const useAuth = create((set, get) => ({
  currentUser: storedUser,
  loading: false,
  isAuthenticated: Boolean(storedUser),
  authChecked: false,
  error: null,
  checkAuth: async () => {
    try {
      set((state) => ({ ...state, loading: true, error: null }));
      const res = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
        withCredentials: true,
      });
      const checkedUser = res.data?.payload;
      const currentUser = get().currentUser;
      const mergedUser = {
        ...currentUser,
        ...checkedUser,
        _id: checkedUser?._id || checkedUser?.id || currentUser?._id,
      };

      storeUser(mergedUser);
      set({
        currentUser: mergedUser,
        loading: false,
        isAuthenticated: true,
        authChecked: true,
        error: null,
      });
    } catch {
      clearStoredUser();
      set({
        currentUser: null,
        loading: false,
        isAuthenticated: false,
        authChecked: true,
        error: null,
      });
    }
  },
  login: async (userCred) => {
    //const { role, ...userCredObj } = userCredWithRole;
    try {
      //set loading true
      set((stat) => ({ ...stat, loading: true }));
      //make api call
      let res = await axios.post(`${API_BASE_URL}/auth/login`, userCred, { withCredentials: true });
      //update state
      const loggedInUser = res.data?.payload || res.data?.user || res.data;
      storeUser(loggedInUser);
      set((stat) => ({
        ...stat,
        loading: false,
        isAuthenticated: true,
        currentUser: loggedInUser,
        authChecked: true,
        error: null,
      }));
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        authChecked: true,
        //error: err,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      set((state) => ({ ...state, loading: true, error: null }));
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      clearStoredUser();
      set({
        currentUser: null,
        loading: false,
        isAuthenticated: false,
        authChecked: true,
        error: null,
      });
    } catch (err) {
      clearStoredUser();
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        authChecked: true,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },
}));
