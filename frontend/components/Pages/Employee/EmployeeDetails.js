import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { getEmployeeById } from "../../../services/apiEmployee";
import Icon from "react-native-vector-icons/MaterialIcons";

const EmployeeDetails = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error("Erreur lors de la récup de l'employé:", error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleCall = async () => {
    if (!employee?.phone) return;

    const phoneUrl = `tel:${employee.phone.replace(/\s+/g, "")}`;
    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
    }
  };

  const handleEmail = async () => {
    if (!employee?.email) return;

    const emailUrl = `mailto:${employee.email.trim()}`;
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi d'email:", error);
    }
  };

  if (!employee) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>Chargement des informations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {employee.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <View style={[styles.actionIcon, { backgroundColor: "#4CAF50" }]}>
            <Icon name="phone" size={24} color="#FFF" />
          </View>
          <Text style={styles.actionText}>Appeler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <View style={[styles.actionIcon, { backgroundColor: "#2196F3" }]}>
            <Icon name="email" size={24} color="#FFF" />
          </View>
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations de contact</Text>
        <View style={styles.infoRow}>
          <Icon name="email" size={20} color="#666" />
          <Text style={styles.infoText}>{employee.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>{employee.phone}</Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditEmployee", { employee })}
      >
        <Text style={styles.editButtonText}>Modifier l'employé</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  headerSection: {
    backgroundColor: "#FFF",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  actionButton: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFF",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    backgroundColor: "#2196F3",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    fontSize: 16,
    color: "#666",
  },
});

export default EmployeeDetails;
