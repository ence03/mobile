import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";

const PurifierScreen = () => {
  const { devices, updateDevice, fetchDevices } = useDeviceStore();
  const [purifyingMessage, setPurifyingMessage] = useState({});

  // Fetch devices on component mount
  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleRelayState = (device) => {
    const updatedRelayState = !device.relayState;
    updateDevice(device._id, { relayState: updatedRelayState });

    if (!updatedRelayState) {
      // Reset duration when turning off
      updateDevice(device._id, { operationDuration: null });
      setPurifyingMessage((prev) => ({
        ...prev,
        [device._id]: null,
      }));
    }
  };

  const updateDuration = (device, duration) => {
    const durationString = duration === 60 ? "1hr" : `${duration}min`;
    updateDevice(device._id, { operationDuration: durationString });
    setPurifyingMessage((prev) => ({
      ...prev,
      [device._id]: `Purifying for ${durationString}`,
    }));
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
                {item.relayState ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
            <View style={styles.durationContainer}>
              {["10min", "30min", "1hr"].map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.durationButton,
                    item.operationDuration === duration
                      ? styles.durationButtonSelected
                      : null,
                  ]}
                  onPress={() =>
                    item.relayState && updateDuration(item, parseInt(duration))
                  }
                  disabled={!item.relayState} // Disable if relay is off
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      item.operationDuration === duration
                        ? styles.durationButtonTextSelected
                        : null,
                      !item.relayState
                        ? styles.durationButtonTextDisabled
                        : null, // Gray text if disabled
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {purifyingMessage[item._id] && (
              <Text style={styles.purifyingMessage}>
                {purifyingMessage[item._id]}
              </Text>
            )}
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
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
    width: 100,
  },
  durationButtonSelected: {
    backgroundColor: "#007BFF",
  },
  durationButtonText: {
    fontSize: 14,
    textAlign: "center",
  },
  durationButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  durationButtonTextDisabled: {
    color: "#aaa",
  },
  purifyingMessage: {
    marginTop: 8,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default PurifierScreen;
