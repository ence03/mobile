import { create } from "zustand";
import axios from "axios";

export const useSensorDataStore = create((set) => ({
  latestData: null,
  isLoading: false,
  error: null,

  fetchLatestSensorData: async () => {
    set({ isLoading: true, error: null });

    try {
      console.log("Fetching sensor data...");
      const response = await axios.get(
        "http://192.168.0.118:7000/api/sensorData/latest"
      );
      console.log("API Response:", response.data);
      st;
      set({ latestData: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching latest sensor data:", error.message);
      set({ error: "Failed to fetch sensor data.", isLoading: false });
    }
  },
}));