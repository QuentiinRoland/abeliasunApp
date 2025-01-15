import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { getInvoices } from "../../../services/apiInvoices";
import Icon from "react-native-vector-icons/MaterialIcons";

const ListingInvoice = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [customerOptions, setCustomerOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);

      const customers = [
        ...new Set(data.map((invoice) => invoice.customer?.name || "Inconnu")),
      ];
      const years = [
        ...new Set(data.map((invoice) => invoice.date.split("-")[0])),
      ];

      setCustomerOptions(customers);
      setYearOptions(years);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    // Appliquer la recherche
    if (searchQuery) {
      filtered = filtered.filter((invoice) =>
        invoice.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Appliquer les filtres
    if (selectedCustomer) {
      filtered = filtered.filter(
        (invoice) => invoice.customer?.name === selectedCustomer
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((invoice) =>
        invoice.date.startsWith(selectedYear)
      );
    }

    setFilteredInvoices(filtered);
  }, [searchQuery, selectedCustomer, selectedYear, invoices]);

  const FilterTag = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterTag, selected && styles.filterTagSelected]}
      onPress={onPress}
    >
      <Text
        style={[styles.filterTagText, selected && styles.filterTagTextSelected]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Clients :</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <FilterTag
            label="Tous"
            selected={selectedCustomer === ""}
            onPress={() => setSelectedCustomer("")}
          />
          {customerOptions.map((customer, index) => (
            <FilterTag
              key={index}
              label={customer}
              selected={selectedCustomer === customer}
              onPress={() => setSelectedCustomer(customer)}
            />
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>Années :</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <FilterTag
            label="Toutes"
            selected={selectedYear === ""}
            onPress={() => setSelectedYear("")}
          />
          {yearOptions.map((year, index) => (
            <FilterTag
              key={index}
              label={year}
              selected={selectedYear === year}
              onPress={() => setSelectedYear(year)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Liste des prestations */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("InvoiceDetails", {
                invoiceId: item.id,
                refreshInvoices: fetchInvoices,
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Prestation #{item.numberInvoice}
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>Date : {item.date}</Text>
            <Text style={styles.cardSubtitle}>
              Client : {item.customer?.name || "Inconnu"}
            </Text>
            <Text style={styles.cardSubtitle}>
              Nombres d'heures :{" "}
              {item.employees?.reduce(
                (sum, emp) => sum + (emp.InvoiceEmployee?.hours || 0),
                0
              )}
              h
            </Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{item.progress || 0}%</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("InvoiceForm", { fetchInvoices })}
      >
        <Text style={styles.addButtonText}>Ajouter une facture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingBottom: 90,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#333",
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterTagSelected: {
    backgroundColor: "#00b341",
    borderColor: "#0056b3",
  },
  filterTagText: {
    fontSize: 14,
    color: "#666",
  },
  filterTagTextSelected: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#00b341",
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  progressContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
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

export default ListingInvoice;
