import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { createEmployee } from "../../../services/apiEmployee";

const Employee = ({ navigation, route }) => {
  const { fetchEmployees } = route.params || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newEmployee = { name, email, phone };
      console.log("Données envoyées :", newEmployee);
      const response = await createEmployee(newEmployee);
      console.log("Réponse du serveur :", response);

      if (!response || !response.id) {
        throw new Error("La réponse du serveur est invalide.");
      }

      fetchEmployees();
      Alert.alert("Succès", "Employé créé avec succès", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de la création de l'employé :", error.message);
      Alert.alert(
        "Erreur",
        "Impossible de créer l'employé. Vérifiez les données ou le serveur."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un employé</Text>

      {/* Image et boutons de modification */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }} // Placeholder pour la photo
          style={styles.profileImage}
        />
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.changeImageButton}>
            <Text style={styles.changeImageText}>Changer l'image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeImageButton}>
            <Text style={styles.removeImageText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulaire */}
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez l'email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le téléphone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Créer l'employé</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  changeImageButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  removeImageButton: {
    backgroundColor: "#FF4444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeImageText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#00b341",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Employee;
