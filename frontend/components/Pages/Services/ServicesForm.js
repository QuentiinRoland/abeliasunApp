import { useState } from "react";
import React from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { createService } from "../../../services/apiServices";

const Service = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("");

  const handleSubmit = async () => {
    try {
      const newService = { name, description, pricing };
      const response = await createService(newService);
      Alert.alert("Succès", `Service créé avec l'ID : ${response.id}`);
      navigation.navigate("ServiceListing");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de créer le service. Vérifiez les données."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez une description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Prix</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le prix"
        value={pricing}
        onChangeText={(text) => setPricing(text)}
        keyboardType="phone-pad"
      />

      <Button title="Créer le service" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default Service;
