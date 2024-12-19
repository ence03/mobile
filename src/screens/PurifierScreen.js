import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";

const PurifierScreen = () => {
  const { devices, updateDevice, fetchDevices } = useDeviceStore();

  // Fetch devices on component mount
  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleRelayState = (device) => {
    const updatedRelayState = !device.relayState;
    updateDevice(device._id, { relayState: updatedRelayState });
  };

  const updateDuration = (device, duration) => {
    updateDevice(device._id, { operationDuration: duration });
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Purifier Control</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <TouchableOpacity
              style={[
                styles.relayButton,
                { backgroundColor: item.relayState ? "#4CAF50" : "#F44336" },
              ]}
              onPress={() => toggleRelayState(item)}
            >
              <Text style={styles.relayButtonText}>
                {item.relayState ? "On" : "Off"}
              </Text>
            </TouchableOpacity>
            <View style={styles.durationContainer}>
              {["10min", "30min", "1hr"].map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.durationButton,
                    item.operationDuration === parseInt(duration)
                      ? styles.durationButtonSelected
                      : null,
                  ]}
                  onPress={() => updateDuration(item, parseInt(duration))}
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      item.operationDuration === parseInt(duration)
                        ? styles.durationButtonTextSelected
                        : null,
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No devices available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  deviceItem: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  relayButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 8,
  },
  relayButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  durationButtonSelected: {
    backgroundColor: "#007BFF",
  },
  durationButtonText: {
    fontSize: 14,
  },
  durationButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PurifierScreen;
