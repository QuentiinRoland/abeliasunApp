import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Librairie pour les icônes
import { AuthContext } from "../contexts/AuthContext"; // Adapter le chemin si nécessaire
import { useNavigation } from "@react-navigation/native";

const AccountPage = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const navigation = useNavigation();

  const goToUserManagement = () => {
    navigation.navigate("UserManagement");
  };

  const goToEmployeeDashboard = () => {
    navigation.navigate("EmployeeDashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header avec photo de profil */}
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{
            uri: user?.photoURL || "https://via.placeholder.com/80", // Photo utilisateur ou placeholder
          }}
        />
        <Text style={styles.profileName}>
          {user?.displayName || "Utilisateur anonyme"}
        </Text>
        <Text style={styles.profileHandle}>{user?.email || "Aucun email"}</Text>
      </View>

      {/* Section Administration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Administration</Text>

        <TouchableOpacity style={styles.menuItem} onPress={goToUserManagement}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Gestion des comptes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={goToEmployeeDashboard}
        >
          <Ionicons name="analytics-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Dashboard Employés</Text>
        </TouchableOpacity>
      </View>

      {/* Section générale */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Sécurité et connexion</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="headset-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Support client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="language-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Langue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="share-social-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Partager l'application</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Déconnexion */}
      <TouchableOpacity
        style={[styles.menuItem, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.memberId}>Member ID: 19202033724</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Ionicons name="copy-outline" size={16} color="#007bff" />
          <Text style={styles.copyText}>Copier</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Version - 03</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileHandle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  memberId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  copyText: {
    marginLeft: 5,
    color: "#007bff",
    fontSize: 14,
  },
  version: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default AccountPage;
