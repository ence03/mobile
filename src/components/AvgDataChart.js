import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import useAverageStore from "../store/avgDataStore";

const AvgDataChart = () => {
  const { averages, fetchAverages, loading, error, listenForNewData } =
    useAverageStore((state) => state);

  // Fetch averages on component mount
  useEffect(() => {
    listenForNewData();

    fetchAverages();
  }, [fetchAverages, listenForNewData]);

  // If data is loading or there is an error, show appropriate message
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Assuming the `averages` state is an array, you can map through it
  return (
    <View style={styles.container}>
      {averages.length > 0 ? (
        averages.map((average, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.text}>
              Average Temperature: {average.avgTemperature}°C
            </Text>
            <Text style={styles.text}>
              Average Humidity: {average.avgHumidity}%
            </Text>
            <Text style={styles.text}>Average TVOC: {average.avgTVOC} ppb</Text>
            <Text style={styles.text}>
              Air Quality Status: {average.airQualityStatus}
            </Text>
          </View>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: "100%",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default AvgDataChart;
