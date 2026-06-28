import { create } from "zustand";

const useStudioStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  projects: [],
  loading: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    set({ token });
  },

  setProjects: (projects) => set({ projects }),

  setLoading: (loading) => set({ loading }),

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      projects: [],
    });
  },
}));

export default useStudioStore;