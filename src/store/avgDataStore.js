import { create } from "zustand";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://192.168.0.118:7000");

const useAverageStore = create((set) => ({
  averages: [],
  loading: false,
  error: null,

  // Action to fetch averages from the backend (hourly or daily)
  fetchAverages: async (type = "hourly") => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `http://192.168.0.118:7000/api/average?type=${type}`
      );
      set({ averages: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action to create a new average and update the state
  createAverage: async (newAverageData) => {
    try {
      const response = await axios.post(
        "http://192.168.0.118:7000/api/average/",
        newAverageData
      );
      if (response.data.success) {
        set((state) => ({
          averages: [...state.averages, response.data.data],
        }));
      }
    } catch (error) {
      console.error("Failed to create average:", error);
    }
  },

  // Action to start listening for new data from the socket
  listenForNewData: () => {
    // Remove any existing listeners to prevent duplicates
    socket.off("newAvgData");

    socket.on("newAvgData", (newAvgData) => {
      set((state) => ({
        averages: [...state.averages, newAvgData], // Update the averages state with new data
      }));
    });
  },

  // Action to calculate and send hourly average
  calculateAndSendHourlyAverage: (latestData) => {
    if (!latestData) {
      console.log("[Error] No sensor data available to calculate averages.");
      return;
    }

    console.log(
      "[Info] Calculating hourly average with latest sensor data:",
      latestData
    );

    // Extract sensor data
    const { temperature, humidity, tvoc } = latestData;

    if (
      temperature === undefined ||
      humidity === undefined ||
      tvoc === undefined
    ) {
      console.log("[Warning] Incomplete sensor data received:", latestData);
      return;
    }

    // Calculate averages for the current hour
    const avgTemperature = temperature;
    const avgHumidity = humidity;
    const avgTVOC = tvoc;

    console.log("[Debug] Calculated averages:");
    console.log(`  Avg Temperature: ${avgTemperature}`);
    console.log(`  Avg Humidity: ${avgHumidity}`);
    console.log(`  Avg TVOC: ${avgTVOC}`);

    // Determine air quality status
    let airQualityStatus = "Good";
    if (avgTemperature > 30) airQualityStatus = "Bad";
    else if (avgHumidity > 60) airQualityStatus = "Fair";

    console.log("[Debug] Determined air quality status:", airQualityStatus);

    // Prepare the average data
    const newAverageData = {
      type: "hourly",
      avgTemperature,
      avgHumidity,
      avgTVOC,
      airQualityStatus,
    };

    console.log("[Info] Prepared data to be sent:", newAverageData);

    // Post the average data
    set({ loading: true });
    axios
      .post("http://192.168.0.118:7000/api/average", newAverageData)
      .then((response) => {
        if (response.data.success) {
          console.log(
            "[Success] Hourly average data posted successfully:",
            response.data.data
          );
          set({ loading: false });
          socket.emit("newAvgData", response.data.data); // Emit new average to frontend
        } else {
          console.log(
            "[Error] Failed to post hourly average data. Response:",
            response.data
          );
          set({ loading: false });
        }
      })
      .catch((error) => {
        console.error(
          "[Error] Failed to post hourly average data:",
          error.message
        );
        set({ loading: false, error: error.message });
      });
  },

  calculateAndSendDailyAverage: async () => {
    try {
      const currentTime = new Date();
      console.log(`Function executed at: ${currentTime.toISOString()}`);

      // Get sensor data for the last 24 hours
      const pastDayData = await axios.get(
        "http://192.168.0.118:7000/api/sensordata?last=24hours"
      );

      const sensorData = pastDayData.data;

      if (!Array.isArray(sensorData) || sensorData.length === 0) {
        console.log("No data available for the past 24 hours.");
        return; // Exit if no valid data is available
      }

      // Calculate averages
      const avgTemperature =
        pastDayData.reduce((sum, data) => sum + data.temperature, 0) /
        pastDayData.length;
      const avgHumidity =
        pastDayData.reduce((sum, data) => sum + data.humidity, 0) /
        pastDayData.length;
      const avgTVOC =
        pastDayData.reduce((sum, data) => sum + data.tvoc, 0) /
        pastDayData.length;

      // Determine air quality status
      const airQualityStatus =
        avgTemperature > 30 ? "Bad" : avgHumidity > 60 ? "Fair" : "Good";

      // Prepare the new average data
      const newAverageData = {
        type: "daily",
        avgTemperature,
        avgHumidity,
        avgTVOC,
        airQualityStatus,
      };

      // Set loading to true while posting
      set({ loading: true });

      // Post the new daily average data to the backend
      axios
        .post("http://192.168.0.118:7000/api/average", newAverageData)
        .then((response) => {
          if (response.data.success) {
            console.log(
              "[Success] Daily average data posted successfully:",
              response.data.data
            );

            // Update the state with the new daily average
            set((state) => ({
              averages: [...state.averages, response.data.data],
              loading: false,
            }));

            // Emit the new daily average data via socket to the frontend
            socket.emit("newAvgData", response.data.data);
          } else {
            console.log(
              "[Error] Failed to post daily average data. Response:",
              response.data
            );
            set({ loading: false });
          }
        })
        .catch((error) => {
          console.error(
            "[Error] Failed to post daily average data:",
            error.message
          );
          set({ loading: false, error: error.message });
        });

      console.log("Daily average calculated and stored successfully");
    } catch (error) {
      console.error("Error calculating daily average:", error);
      set({ loading: false, error: error.message });
    }
  },
}));

export default useAverageStore;
