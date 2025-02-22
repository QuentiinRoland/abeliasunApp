import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, signInWithEmailAndPassword } from "../../../config/firebaseInit";

const LoginPage = ({ onLogin }) => {
  const navigation = useNavigation();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

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
    <SafeAreaView style={styles.safeArea}>
      {!keyboardVisible && (
        <View style={styles.topSection}>
          <ImageBackground
            source={require("../../../assets/abeliasunLogin2.jpg")}
            style={styles.backgroundImage}
          >
            <View style={styles.darkOverlay}>
              <Text style={styles.title}>
                Transformez Votre Jardin en Un Havre de Paix et de Beauté
              </Text>
            </View>
          </ImageBackground>
        </View>
      )}

      <View
        style={[
          styles.loginSection,
          keyboardVisible && styles.loginSectionExpanded,
        ]}
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
          />
          <TextInput
            placeholder="Votre mot de passe"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            onChangeText={handleInputPassword}
            value={inputPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonTextLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: "45%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
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
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    alignItems: "center",
  },
  loginSectionExpanded: {
    height: "100%",
    marginTop: 0,
  },
  logo: {
    width: 200,
    height: 80,
    marginVertical: 20,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 20,
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
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonTextLogin: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LoginPage;
