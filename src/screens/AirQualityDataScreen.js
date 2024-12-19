import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import ChartMeter from "../components/ChartMeter";
import AirQualityBar from "../components/AirQualityBar";
import Header from "../components/Header";
import { useSensorDataStore } from "../store/sensorDataStore";

const AirQualityDataScreen = () => {
  const { latestData, isLoading, error, fetchLatestSensorData } =
    useSensorDataStore();

  useEffect(() => {
    fetchLatestSensorData();
  }, [fetchLatestSensorData]);

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

  return (
    <View style={styles.container}>
      <Header />
      {latestData ? (
        <>
          <ChartMeter
            title="Temperature (°C)"
            value={latestData.temperature}
            max={105}
            color="#f44336"
          />
          <ChartMeter
            title="Humidity (%)"
            value={latestData.humidity}
            max={80}
            color="#2196f3"
          />
          <ChartMeter
            title="TVOC (ppb)"
            value={latestData.tvoc}
            max={30000}
            color="#4caf50"
          />
          <AirQualityBar status={latestData.airQualityStatus} />
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
