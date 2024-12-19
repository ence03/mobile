import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/logo.png")}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  logo: {
    width: 150,
    height: 50,
  },
});

export default Header;
