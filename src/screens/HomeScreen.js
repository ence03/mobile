import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleToAirQualityData = () => {
    navigation.navigate("airQualityData");
  };

  const handleToGraphicalData = () => {
    navigation.navigate("graphicalData");
  };

  const handleToDevices = () => {
    navigation.navigate("devices");
  };

  const handleToPurifier = () => {
    navigation.navigate("purifier");
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.dashboard}>
        <Image
          style={styles.logo}
          source={require("../../assets/appIcon.png")}
          resizeMode="contain"
        />
        <Text style={styles.label}>Choose where to navigate</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleToAirQualityData}
            style={styles.btns}
          >
            <Text style={styles.btnsText}>Air Quality Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToGraphicalData} style={styles.btns}>
            <Text style={styles.btnsText}>Graphical Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToPurifier} style={styles.btns}>
            <Text style={styles.btnsText}> Purifier</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToDevices} style={styles.btns}>
            <Text style={styles.btnsText}>Devices</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboard: {
    padding: 10,
    width: "100%",
  },
  logo: {
    width: 400,
    height: 200,
    alignSelf: "center",
  },
  label: {
    fontSize: 13,
    textAlign: "center",
  },
  buttons: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 30,
    gap: 15,
  },
  btns: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#5073FA",
  },
  btnsText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
