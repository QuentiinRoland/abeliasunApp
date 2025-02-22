import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, signInWithEmailAndPassword } from "../../../config/firebaseInit";

const LoginPage = ({ onLogin }) => {
  const navigation = useNavigation();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const handleInputName = (text) => setInputEmail(text);
  const handleInputPassword = (text) => setInputPassword(text);

  const handleLogin = async () => {
    if (inputEmail && inputPassword) {
      try {
        await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
        onLogin && onLogin();
      } catch (error) {
        alert("Erreur lors de la connexion : " + error.message);
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ImageBackground
        source={require("../../../assets/abeliasunLogin2.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.darkOverlay}>
          <View style={styles.overlay}>
            <Text style={styles.title}>
              Transformez Votre Jardin en Un Havre de Paix et de Beauté
            </Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView
        style={styles.loginSection}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../../assets/abeliasunWallpaperLogin.jpg")}
          style={styles.logo}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Votre adresse mail"
            placeholderTextColor="#888"
            style={styles.input}
            onChangeText={handleInputName}
            value={inputEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <TextInput
            placeholder="Votre mot de passe"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            onChangeText={handleInputPassword}
            value={inputPassword}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleLogin();
            }}
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              Keyboard.dismiss();
              handleLogin();
            }}
          >
            <Text style={styles.buttonTextLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    width: "100%",
    height: "60%",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
    maxWidth: 300,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loginSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -100,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingTop: 10,
    paddingBottom: 200,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonTextLogin: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LoginPage;
