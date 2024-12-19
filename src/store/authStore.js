import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Action to set user details after login
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),

  // Action to clear user details after logout
  clearUser: () => set({ user: null, token: null, isAuthenticated: false }),

  // Action to update the user's information (e.g., after registration)
  updateUser: (user) => set({ user }),

  // Action to check if the user is authenticated
  checkAuth: () => set((state) => state.isAuthenticated),
}));

export default useAuthStore;
