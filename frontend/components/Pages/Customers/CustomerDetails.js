import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { getCustomerById } from "../../../services/apiCustomer";
import { deleteCustomer } from "../../../services/apiCustomer";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomerDetails = ({ route, navigation }) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomerById(customerId);
        if (typeof data.additionalEmail === "string") {
          data.additionalEmail = JSON.parse(data.additionalEmail);
        }
        setCustomer(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du client :", error);
      }
    };

    fetchCustomers();
  }, [customerId]);

  const handleDeleteCustomer = async () => {
    try {
      console.log("Suppression en cours...");
      await deleteCustomer(customer.id);
      if (route.params?.refreshCustomers) {
        console.log("Rafraîchissement des données...");
        await route.params.refreshCustomers();
      }
      console.log("Retour à l'écran précédent");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleCall = () => {
    if (customer?.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const handleEmail = (emailAddress) => {
    if (emailAddress) {
      Linking.openURL(`mailto:${emailAddress}`);
    }
  };

  const handleMap = () => {
    const address = `${customer?.street}, ${customer?.city} ${customer?.postalCode}`;
    Linking.openURL(
      `https://maps.google.com/?q=${encodeURIComponent(address)}`
    );
  };

  const ActionButton = ({ icon, label, onPress, color }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color="#FFF" />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!customer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>Chargement des informations...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {customer.name[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{customer.name}</Text>
        <View style={styles.quickActions}>
          <ActionButton
            icon="phone"
            label="Appeler"
            onPress={handleCall}
            color="#4CAF50"
          />
          <ActionButton
            icon="email"
            label="Email"
            onPress={() => handleEmail(customer.email)}
            color="#2196F3"
          />
          <ActionButton
            icon="map"
            label="Carte"
            onPress={handleMap}
            color="#FF9800"
          />
        </View>
      </View>

      {/* Informations Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations de contact</Text>

        {/* Email principal */}
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleEmail(customer.email)}
        >
          <Icon name="email" size={20} color="#666" />
          <Text style={styles.infoText}>{customer.email}</Text>
          <Text style={styles.emailLabel}>Principal</Text>
        </TouchableOpacity>

        {/* Emails additionnels */}
        {customer.additionalEmail && customer.additionalEmail.length > 0 && (
          <>
            {customer.additionalEmail.map((email, index) => (
              <TouchableOpacity
                key={index}
                style={styles.infoRow}
                onPress={() => handleEmail(email)}
              >
                <Icon name="alternate-email" size={20} color="#666" />
                <Text style={styles.infoText}>{email}</Text>
                <Text style={styles.emailLabel}>Secondaire</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Téléphone */}
        <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>{customer.phone}</Text>
        </TouchableOpacity>
      </View>

      {/* Address Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Adresse</Text>
        <TouchableOpacity style={styles.addressContainer} onPress={handleMap}>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color="#666" />
            <Text style={styles.infoText}>{customer.street}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-city" size={20} color="#666" />
            <Text style={styles.infoText}>
              {customer.city}, {customer.postalCode}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: "#2196F3" }]}
        onPress={() => navigation.navigate("EditCustomer", { customer })}
      >
        <Icon name="edit" size={20} color="#FFF" style={styles.buttonIcon} />
        <Text style={styles.editButtonText}>Modifier le client</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: "#4CAF50" }]}
        onPress={() => navigation.navigate("CustomerAdd", { customer })}
      >
        <Icon
          name="person-add"
          size={20}
          color="#FFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.editButtonText}>Ajouter un client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.editButton,
          { backgroundColor: "#ff0000", marginBottom: 60 },
        ]}
        onPress={handleDeleteCustomer}
      >
        <Icon name="delete" size={20} color="#FFF" style={styles.buttonIcon} />
        <Text style={styles.editButtonText}>Supprimer un client</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContent: {
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
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
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  emailLabel: {
    fontSize: 12,
    color: "#2196F3",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addressContainer: {
    opacity: 0.9,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonIcon: {
    marginRight: 8,
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

export default CustomerDetails;
