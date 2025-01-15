import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  auth,
} from "../../config/firebaseConfig";
import { getAuthUsers, deleteAuthUser } from "../../services/apiAuth";

const UserManagement = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAuthUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de récupérer la liste des utilisateurs."
      );
      console.error(error);
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Succès", "Utilisateur créé avec succès");
        setEmail("");
        setPassword("");
        fetchUsers(); // Refresh the user list
      } catch (error) {
        Alert.alert("Erreur", error.message);
      }
    } else {
      Alert.alert("Attention", "Veuillez remplir tous les champs");
    }
  };

  const handleDeleteUser = async (uid) => {
    try {
      await deleteAuthUser(uid);
      Alert.alert("Succès", "Utilisateur supprimé avec succès");
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer l'utilisateur");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Création d'un compte employé</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Liste des utilisateurs</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userName}>{item.email}</Text>
                <Text style={styles.userUid}>{item.uid}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(item.uid)}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 10,
    textAlign: "center",
    color: "#007AFF",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userUid: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default UserManagement;
