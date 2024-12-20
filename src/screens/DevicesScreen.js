import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";

const DevicesScreen = () => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceLocation, setDeviceLocation] = useState(""); // State for location
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [deviceToEdit, setDeviceToEdit] = useState(null); // State for the device to edit

  const { devices, addDevice, deleteDevice, updateDevice, fetchDevices } =
    useDeviceStore();

  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleAddDevice = () => {
    if (deviceName.trim() && deviceLocation.trim()) {
      addDevice({
        name: deviceName,
        relayState: false,
        operationDuration: null,
        location: deviceLocation,
      });
      setDeviceName("");
      setDeviceLocation(""); // Reset location input
      setAddModalVisible(false); // Close modal after adding the device
    }
  };

  const handleDeleteDevice = (id) => {
    deleteDevice(id);
  };

  const handleEditDevice = (device) => {
    setDeviceToEdit(device);
    setDeviceName(device.name);
    setDeviceLocation(device.location);
    setEditModalVisible(true);
  };

  const handleUpdateDevice = () => {
    if (deviceName.trim() && deviceLocation.trim() && deviceToEdit) {
      updateDevice({
        ...deviceToEdit,
        name: deviceName,
        location: deviceLocation,
      });
      setDeviceName("");
      setDeviceLocation(""); // Reset location input
      setEditModalVisible(false); // Close modal after editing
      setDeviceToEdit(null); // Reset the device being edited
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
              <Text style={styles.deviceLocation}>{item.location}</Text>{" "}
              {/* Show location */}
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
      {/* Add Device Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Device</Text>
      </TouchableOpacity>

      {/* Add Device Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Device</Text>

            {/* Device Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />

            {/* Location Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter device location"
              value={deviceLocation}
              onChangeText={setDeviceLocation}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addDeviceButton}
                onPress={handleAddDevice}
              >
                <Text style={styles.buttonText}>Add Device</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Device Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Device</Text>

            {/* Device Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />

            {/* Location Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter device location"
              value={deviceLocation}
              onChangeText={setDeviceLocation}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addDeviceButton}
                onPress={handleUpdateDevice}
              >
                <Text style={styles.buttonText}>Update Device</Text>
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
  deviceLocation: {
    fontSize: 12,
    color: "#555",
    marginTop: 4, // Added margin for spacing
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
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
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
  addDeviceButton: {
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
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
});

export default DevicesScreen;
