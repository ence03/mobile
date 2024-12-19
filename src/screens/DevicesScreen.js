import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Button,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";

const DevicesScreen = () => {
  const [deviceName, setDeviceName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [relayState, setRelayState] = useState(false);
  const [operationDuration, setOperationDuration] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const { devices, addDevice, deleteDevice, updateDevice, fetchDevices } =
    useDeviceStore();

  // Fetch devices on component mount
  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleAddDevice = () => {
    if (deviceName.trim()) {
      addDevice({
        name: deviceName,
        relayState: false,
        operationDuration: null,
      });
      setDeviceName("");
    }
  };

  const handleDeleteDevice = (id) => {
    deleteDevice(id);
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setRelayState(device.relayState ?? false);
    setOperationDuration(device.operationDuration ?? null);
    setEditModalVisible(true);
  };

  const handleUpdateDevice = () => {
    if (selectedDevice) {
      updateDevice(selectedDevice._id, { relayState, operationDuration });
      setEditModalVisible(false);
      setSelectedDevice(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Your Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text>{item.name}</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditDevice(item)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDevice(item._id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No devices added yet.</Text>}
      />
      <View style={styles.addDeviceContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter device name"
          value={deviceName}
          onChangeText={setDeviceName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
          <Text style={styles.addButtonText}>Add Device</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Device</Text>
            <TextInput
              style={styles.input}
              placeholder="Relay State (true/false)"
              value={relayState?.toString() ?? "false"}
              onChangeText={(value) => setRelayState(value === "true")}
            />
            <TextInput
              style={styles.input}
              placeholder="Operation Duration (in minutes)"
              keyboardType="numeric"
              value={operationDuration?.toString() ?? "0"}
              onChangeText={(value) => setOperationDuration(Number(value))}
            />
            <View style={styles.modalActions}>
              <Button title="Update" onPress={handleUpdateDevice} />
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    marginHorizontal: 10,
  },
  deviceItem: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  addDeviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
});

export default DevicesScreen;
