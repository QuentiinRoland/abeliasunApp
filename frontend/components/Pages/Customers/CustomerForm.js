import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { createCustomer } from "../../../services/apiCustomer";

const Customer = ({ route, navigation }) => {
  const { fetchCustomers } = route.params || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [additionalEmail, setAdditionalEmail] = useState([]);

  const addEmail = () => {
    if (!newEmail) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    if (newEmail === email || additionalEmail.includes(newEmail)) {
      Alert.alert("Erreur", "Cette adresse email existe déjà");
      return;
    }

    setAdditionalEmail([...additionalEmail, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (emailToRemove) => {
    setAdditionalEmail(
      additionalEmail.filter((email) => email !== emailToRemove)
    );
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !street || !city || !postalCode) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      const newCustomer = {
        name,
        email,
        additionalEmail,
        phone,
        street,
        city,
        postalCode,
      };

      const response = await createCustomer(newCustomer);
      Alert.alert("Succès", `Client créé avec l'ID : ${response.id}`);
      fetchCustomers();
      navigation.navigate("CustomerListing");
    } catch (error) {
      console.error("Customer creation error:", error);
      if (error?.response?.status === 401) {
        Alert.alert(
          "Erreur d'authentification",
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de créer le client. Veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Créer un client</Text>

        {/* Section pour l'image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
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
          onChangeText={setName}
        />

        <Text style={styles.label}>Email principal</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'email principal"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Emails additionnels</Text>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Nouvel email additionnel"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addButton} onPress={addEmail}>
            <Icon name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {additionalEmail.map((additionalEmail, index) => (
          <View key={index} style={styles.emailChip}>
            <Text style={styles.emailChipText}>{additionalEmail}</Text>
            <TouchableOpacity
              onPress={() => removeEmail(additionalEmail)}
              style={styles.removeButton}
            >
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Rue"
          value={street}
          onChangeText={setStreet}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.cityInput]}
            placeholder="Ville"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, styles.postalInput]}
            placeholder="Code postal"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Créer le client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F4F4",
      padding: 20,
    },
    scrollViewContainer: {
      padding: 20,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
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
      backgroundColor: "#F9F9F9",
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#007BFF",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  }),

  emailInputContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emailChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  emailChipText: {
    flex: 1,
    fontSize: 14,
    color: "#1976D2",
  },
  removeButton: {
    padding: 4,
  },
});

export default Customer;
