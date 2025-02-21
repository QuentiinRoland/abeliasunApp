import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { updateCustomer } from "../../../services/apiCustomer";

const EditCustomer = ({ route, navigation }) => {
  const { customer } = route.params;
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [street, setStreet] = useState(customer.street);
  const [city, setCity] = useState(customer.city);
  const [postalCode, setPostalCode] = useState(customer.postalCode);
  const [newEmail, setNewEmail] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState(
    customer.additionalEmails || []
  );

  const addEmail = () => {
    if (!newEmail) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    if (newEmail === email || additionalEmails.includes(newEmail)) {
      Alert.alert("Erreur", "Cette adresse email existe déjà");
      return;
    }

    setAdditionalEmails([...additionalEmails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (emailToRemove) => {
    setAdditionalEmails(
      additionalEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleUpdate = async () => {
    try {
      await updateCustomer(customer.id, {
        name,
        email,
        additionalEmails,
        phone,
        street,
        city,
        postalCode,
      });
      Alert.alert("Succès", "Le client a été modifié avec succès !");
      navigation.navigate("CustomerListing");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de modifier le client.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Modifier le client</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email principal</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
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

        {additionalEmails.map((additionalEmail, index) => (
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
          placeholder="Téléphone"
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

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Icon name="save" size={24} color="#FFF" />
          <Text style={styles.updateButtonText}>
            Enregistrer les modifications
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cityInput: {
    flex: 1,
    marginRight: 8,
  },
  postalInput: {
    flex: 1,
  },
  emailInputContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
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
  updateButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EditCustomer;
