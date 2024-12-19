import { create } from "zustand";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://192.168.0.118:7000");

const useAverageStore = create((set) => ({
  averages: [],
  loading: false,
  error: null,

  // Action to fetch averages from the backend
  fetchAverages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        "http:///192.168.0.118:7000/api/average/"
      ); // Replace with your actual API endpoint
      set({ averages: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action to create a new average and update the state
  createAverage: async (newAverageData) => {
    try {
      const response = await axios.post(
        "http:///192.168.0.118:7000/api/average/",
        newAverageData
      ); // Replace with your actual API endpoint
      if (response.data.success) {
        set((state) => ({
          averages: [...state.averages, response.data.data],
        }));
      }
    } catch (error) {
      console.error("Failed to create average:", error);
    }
  },

  listenForNewData: () => {
    socket.on("newAvgData", (newAvgData) => {
      set((state) => ({
        averages: [...state.averages, newAvgData], // Update the averages state with new data
      }));
    });
  },
}));

export default useAverageStore;
