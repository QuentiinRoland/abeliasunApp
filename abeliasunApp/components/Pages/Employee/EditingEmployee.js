import { useState } from "react";
import React from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { updateEmployee } from "../../../services/apiEmployee";

const EditEmployee = ({ route, navigation }) => {
  const { employee } = route.params;
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone);

  const handleUpdate = async () => {
    try {
      await updateEmployee(employee.id, { name, email, phone });
      Alert.alert("Succès", `L'employe à été modifié avec succès`);
      navigation.navigate("EmployeeListing");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de modifier le client.");
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      />
      <Button title="Enregistrer les modifications" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default EditEmployee;
