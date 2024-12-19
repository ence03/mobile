import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRegister = () => {
    navigation.navigate("login");
  };

  const handleGoToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Register an account</Text>
      <View style={styles.fields}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
        />
        <View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.toggleButton}
          >
            <Icon
              name={isPasswordVisible ? "visibility-off" : "visibility"}
              size={30}
              color="#5073FA"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleRegister} style={styles.btn}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoToLogin}>
          <Text style={styles.btn2Text}>
            Already have an account? Sign in here.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
    color: "#5073FA",
    letterSpacing: 2,
  },
  fields: {
    width: "80%",
    alignSelf: "center",
    marginTop: 40,
    gap: 20,
  },
  input: {
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  btn: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#5073FA",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  btn2Text: {
    fontSize: 12,
    textAlign: "center",
  },
  toggleButton: {
    position: "absolute",
    right: 5,
    padding: 10,
  },
});

export default RegisterScreen;
