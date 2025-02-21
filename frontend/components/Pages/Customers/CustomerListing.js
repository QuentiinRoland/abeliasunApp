import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getCustomers } from "../../../services/apiCustomer";

const CustomerListing = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleCall = async (phone) => {
    if (!phone) return;

    const phoneUrl = `tel:${phone.replace(/\s+/g, "")}`;
    try {
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
    }
  };

  const handleEmail = async (email) => {
    if (!email) return;

    const emailUrl = `mailto:${email.trim()}`;
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi d'email:", error);
    }
  };

  const CustomerCard = ({ customer }) => {
    const initials = customer.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const randomColor = `hsl(${Math.random() * 360}, 70%, 45%)`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("CustomerDetails", {
            customerId: customer.id,
            refreshCustomers: () => {
              fetchCustomers(), navigation.navigate("CustomerListing");
            },
          })
        }
      >
        <View
          style={[styles.avatarContainer, { backgroundColor: randomColor }]}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {customer.email}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(customer.phone)}
          >
            <Icon name="phone" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEmail(customer.email)}
          >
            <Icon name="email" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement de vos clients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Votre réseau de clients</Text>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CustomerCard customer={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="person-search" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Aucun client trouvé</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("CustomerAdd", { fetchCustomers: fetchCustomers })
        }
      >
        <Text style={styles.addButtonText}>Créer un client</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: 90,
  },
  header: {
    backgroundColor: "#FFF",
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  quickActions: {
    flexDirection: "row",
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#00b341",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomerListing;
