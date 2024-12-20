import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import ChartMeter from "../components/ChartMeter";
import AirQualityBar from "../components/AirQualityBar";
import Header from "../components/Header";
import { useSensorDataStore } from "../store/sensorDataStore";

const AirQualityDataScreen = () => {
  const {
    latestData,
    isLoading,
    error,
    fetchLatestSensorData,
    listenForNewData,
  } = useSensorDataStore();

  useEffect(() => {
    listenForNewData();

    fetchLatestSensorData();
  }, [fetchLatestSensorData, listenForNewData]);

  console.log("Latest Data in Component:", latestData);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text>Loading sensor data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const getHumidityColor = (humidity) => {
    if (humidity < 40 || humidity > 60) return "#f44336"; // Red
    if (humidity >= 40 && humidity <= 60) return "#FFC107"; // Yellow
    return "#4caf50"; // Green
  };

  const getTemperatureColor = (temperature) => {
    if (temperature < 18 || temperature > 24) return "#f44336"; // Red
    if (temperature >= 21 && temperature <= 24) return "#FFC107"; // Yellow
    return "#4caf50"; // Green
  };

  const getTVOCColor = (tvoc) => {
    if (tvoc >= 2200 && tvoc <= 30000) return "#f44336"; // Red
    if (tvoc >= 400 && tvoc < 2200) return "#FFC107"; // Yellow
    return "#4caf50"; // Green
  };

  return (
    <View style={styles.container}>
      <Header />
      {latestData ? (
        <>
          <ChartMeter
            title="Temperature (°C)"
            value={latestData.temperature}
            max={105}
            color={getTemperatureColor(latestData.temperature)}
          />
          <ChartMeter
            title="Humidity (%)"
            value={latestData.humidity}
            max={100}
            color={getHumidityColor(latestData.humidity)}
          />
          <ChartMeter
            title="TVOC (ppb)"
            value={latestData.tvoc}
            max={30000}
            color={getTVOCColor(latestData.tvoc)}
          />
          <AirQualityBar
            airQualityStatus={latestData ? latestData.airQualityStatus : "Good"}
          />
        </>
      ) : (
        <Text>No sensor data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default AirQualityDataScreen;
