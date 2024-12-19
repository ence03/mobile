import { create } from "zustand";
import axios from "axios";

const API_URL = "http:///192.168.0.118:7000/api/device/";

const useDeviceStore = create((set) => ({
  devices: [],
  loading: false,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ devices: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addDevice: async (device) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, device);
      set((state) => ({
        devices: [...state.devices, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateDevice: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      set((state) => ({
        devices: state.devices.map((device) =>
          device._id === id ? response.data.data : device
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  deleteDevice: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        devices: state.devices.filter((device) => device._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useDeviceStore;
