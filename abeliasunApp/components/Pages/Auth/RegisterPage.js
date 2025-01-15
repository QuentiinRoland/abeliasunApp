import React, { useState } from "react";
import { View, Text, Alert, TextInput, Button } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
} from "../../../config/firebaseConfig";

const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Compte créer");
        navigation.navigate("Login");
      } catch (error) {
        alert("Erreur lors de la création du compte : " + error.message);
      }
    } else {
      Alert.alert("Veuillez remplir tout les champs");
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Créer un compte</Text>
      <TextInput
        placeholder="Email"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
        onChangeText={setPassword}
        value={password}
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

export default RegisterPage;
