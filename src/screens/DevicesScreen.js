import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Button,
  Image,
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
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceStatus}>
                {item.relayState ? "ON" : "OFF"}
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditDevice(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDevice(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No devices added yet.</Text>
        }
      />
      <View style={styles.addDeviceContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter device name"
          value={deviceName}
          onChangeText={setDeviceName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
          <Text style={styles.addButtonText}>+ Add Device</Text>
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
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateDevice}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 16,
  },
  deviceItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyList: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
  addDeviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default DevicesScreen;
