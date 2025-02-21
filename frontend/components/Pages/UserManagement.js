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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";

const UserManagement = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setCurrentEmail(currentUser.email);
      setCurrentPassword("your-temporary-password");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, "users"));

      if (querySnapshot.empty) {
        console.log("Aucun utilisateur trouvé dans Firestore.");
        setUsers([]);
      } else {
        const userList = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        console.log("Utilisateurs récupérés :", userList);
        setUsers(userList);
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de récupérer la liste des utilisateurs."
      );
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  const reauthenticateUser = async () => {
    try {
      const auth = getAuth();
      if (!currentEmail || !currentPassword) {
        throw new Error(
          "Email ou mot de passe de l'utilisateur connecté non disponible."
        );
      }
      await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
      console.log("Utilisateur réauthentifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la réauthentification :", error);
      throw new Error("Impossible de réauthentifier l'utilisateur.");
    }
  };

  const handleCreateUser = async () => {
    const auth = getAuth();
    let currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("Aucune session active. Réauthentification...");
      try {
        await reauthenticateUser();
        currentUser = auth.currentUser;
      } catch (error) {
        Alert.alert("Erreur", "Impossible de réauthentifier l'utilisateur.");
        return;
      }
    }

    if (!currentUser) {
      Alert.alert("Erreur", "Aucun utilisateur actuellement connecté.");
      return;
    }

    try {
      const currentUserToken = await currentUser.getIdToken();

      console.log("Nom :", name);
      console.log("Email :", email);
      console.log("Password :", password);
      console.log("Current User Email :", currentUser.email);
      console.log("Current User Token :", currentUserToken);

      const response = await fetch(
        "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/auth/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            displayName: name,
            currentUserEmail: currentUser.email,
            currentUserToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Nouvel utilisateur créé avec succès :", data.newUser);

        setName("");
        setEmail("");
        setPassword("");

        await fetchUsers();

        Alert.alert("Succès", "Nouvel utilisateur créé avec succès !");
      } else {
        console.error("Erreur depuis le serveur :", data);
        Alert.alert("Erreur", data.message || "Erreur inconnue.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      Alert.alert("Erreur", "Impossible de créer l'utilisateur.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(firestore, "users", userId));
      console.log("Utilisateur supprimé avec succès :", userId);

      // Met à jour la liste des utilisateurs
      await fetchUsers();

      Alert.alert("Succès", "Utilisateur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      Alert.alert("Erreur", "Impossible de supprimer l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Création d'un compte employé</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nom"
          autoCapitalize="words"
        />
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
                <Text style={styles.userName}>{item.displayName}</Text>
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
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default UserManagement;
