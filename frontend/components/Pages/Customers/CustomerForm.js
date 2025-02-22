import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { createCustomer } from "../../../services/apiCustomer";

const Customer = ({ route, navigation }) => {
  const { fetchCustomers } = route.params || {};
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [additionalEmail, setAdditionalEmail] = React.useState([]);

  const addEmail = () => {
    Keyboard.dismiss();
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
    Keyboard.dismiss();
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Créer un client</Text>

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

          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le nom"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <Text style={styles.label}>Email principal</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez l'email principal"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
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
              returnKeyType="done"
              onSubmitEditing={addEmail}
            />
            <TouchableOpacity style={styles.addButton} onPress={addEmail}>
              <Icon name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {additionalEmail.map((email, index) => (
            <View key={index} style={styles.emailChip}>
              <Text style={styles.emailChipText}>{email}</Text>
              <TouchableOpacity
                onPress={() => removeEmail(email)}
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
            returnKeyType="next"
          />

          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            placeholder="Rue"
            value={street}
            onChangeText={setStreet}
            returnKeyType="next"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.cityInput]}
              placeholder="Ville"
              value={city}
              onChangeText={setCity}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, styles.postalInput]}
              placeholder="Code postal"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Créer le client</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 150 : 120,
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
    gap: 10,
  },
  changeImageButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 5,
  },
  changeImageText: {
    color: "#FFF",
    fontSize: 14,
  },
  removeImageButton: {
    backgroundColor: "#DC3545",
    padding: 8,
    borderRadius: 5,
  },
  removeImageText: {
    color: "#FFF",
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
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  cityInput: {
    flex: 2,
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
});

export default Customer;
