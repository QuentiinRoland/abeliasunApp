import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Signature from "react-native-signature-canvas";
import { getEmployees } from "../../../services/apiEmployee";
import { getServices } from "../../../services/apiServices";
import { getCustomers } from "../../../services/apiCustomer";
import { updateInvoice } from "../../../services/apiInvoices";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditInvoice = ({ navigation, route }) => {
  const { invoice, fetchInvoices } = route.params;

  // États
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date(invoice.date) || new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(
    new Date(invoice.date).toISOString().split("T")[0]
  );
  const [numberInvoice, setNumberInvoice] = useState(
    invoice.numberInvoice?.toString() || ""
  );
  const [customerId, setCustomerId] = useState(
    invoice.customerId?.toString() || ""
  );
  const [selectedPictures, setSelectedPictures] = useState(
    invoice.pictures || []
  );
  const [tagline, setTagline] = useState(invoice.tagline || null);
  const [signatureRef, setSignatureRef] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(
    invoice.associatedServices?.reduce(
      (acc, service) => ({
        ...acc,
        [service.id]: true,
      }),
      {}
    ) || {}
  );
  const [selectedSubServices, setSelectedSubServices] = useState(
    invoice.selectedSubServices?.reduce(
      (acc, subService) => ({
        ...acc,
        [subService.id]: true,
      }),
      {}
    ) || {}
  );
  const [employeeHours, setEmployeeHours] = useState(
    invoice.employees?.map((emp) => ({
      employeeId: emp.id,
      hours: emp.InvoiceEmployee.hours,
    })) || []
  );
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, employeesData, customersData] = await Promise.all([
          getServices(),
          getEmployees(),
          getCustomers(),
        ]);

        setServices(servicesData || []);
        setEmployees(employeesData || []);
        setCustomers(customersData || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        Alert.alert("Erreur", "Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDate(selectedDate);
      setFormattedDate(formatted);
    }
  };

  const handleSignature = (signature) => {
    setTagline(signature);
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const toggleSubService = (subServiceId) => {
    setSelectedSubServices((prev) => ({
      ...prev,
      [subServiceId]: !prev[subServiceId],
    }));
  };

  const handleEmployeeHoursChange = (employeeId, hours) => {
    const numericHours = parseFloat(hours) || 0;
    setEmployeeHours((prevHours) => {
      const existingIndex = prevHours.findIndex(
        (e) => e.employeeId === employeeId
      );
      if (existingIndex >= 0) {
        const newHours = [...prevHours];
        newHours[existingIndex] = { employeeId, hours: numericHours };
        return newHours;
      }
      return [...prevHours, { employeeId, hours: numericHours }];
    });
  };

  const handleUpdate = async () => {
    if (!date || !numberInvoice || !customerId) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    const updatedData = {
      date: formattedDate,
      numberInvoice: parseInt(numberInvoice),
      customerId: parseInt(customerId),
      tagline,
      associatedServices: Object.keys(selectedServices)
        .filter((key) => selectedServices[key])
        .map((id) => parseInt(id)),
      selectedSubServices: Object.keys(selectedSubServices)
        .filter((key) => selectedSubServices[key])
        .map((id) => parseInt(id)),
      pictures: selectedPictures,
      employeeHours: employeeHours.map((eh) => ({
        employeeId: eh.employeeId,
        hours: eh.hours,
      })),
    };

    try {
      const updatedInvoice = await updateInvoice(invoice.id, updatedData);
      // Appelle fetchInvoices directement pour recharger les données
      if (fetchInvoices) {
        await fetchInvoices();
      }
      Alert.alert("Succès", "Prestation mise à jour avec succès !");
      navigation.navigate("InvoiceDetails", {
        invoiceId: updatedInvoice.id, // Passe l'ID de la facture éditée
        refresh: true, // Pour signaler un besoin de rafraîchissement
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la prestation.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Modifier la prestation</Text>
      </View>

      {/* Date */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="event" size={20} color="#666" style={styles.icon} />
          Date
        </Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Sélection du client */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="person" size={20} color="#666" style={styles.icon} />
          Client
        </Text>
        <TouchableOpacity
          style={styles.customerSelector}
          onPress={() => {
            Alert.alert(
              "Sélectionner un client",
              "",
              customers
                .map((customer) => ({
                  text: customer.name,
                  onPress: () => {
                    setCustomerId(customer.id.toString());
                  },
                }))
                .concat([{ text: "Annuler", style: "cancel" }])
            );
          }}
        >
          <Text
            style={
              customerId ? styles.customerSelected : styles.customerPlaceholder
            }
          >
            {customerId
              ? customers.find((c) => c.id.toString() === customerId)?.name
              : "Sélectionner un client"}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Services */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="build" size={20} color="#666" style={styles.icon} />
          Services
        </Text>
        {services?.map((service) => (
          <View key={service.id} style={styles.serviceContainer}>
            <TouchableOpacity
              onPress={() => toggleService(service.id)}
              style={[
                styles.serviceButton,
                selectedServices[service.id] && styles.serviceButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.serviceButtonText,
                  selectedServices[service.id] &&
                    styles.serviceButtonTextSelected,
                ]}
              >
                {service.name}
              </Text>
            </TouchableOpacity>

            {selectedServices[service.id] &&
              service.subservices?.map((subService) => (
                <TouchableOpacity
                  key={subService.id}
                  onPress={() => toggleSubService(subService.id)}
                  style={[
                    styles.subServiceButton,
                    selectedSubServices[subService.id] &&
                      styles.subServiceButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.subServiceButtonText,
                      selectedSubServices[subService.id] &&
                        styles.subServiceButtonTextSelected,
                    ]}
                  >
                    {subService.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </View>

      {/* Heures employés */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="schedule" size={20} color="#666" style={styles.icon} />
          Heures par employé
        </Text>
        {employees.map((employee) => (
          <View key={employee.id} style={styles.employeeRow}>
            <View style={styles.employeeInfo}>
              <Icon name="person" size={20} color="#666" />
              <Text style={styles.employeeName}>{employee.name}</Text>
            </View>
            <View style={styles.hoursContainer}>
              <TextInput
                style={styles.hoursInput}
                placeholder="0h"
                keyboardType="numeric"
                onChangeText={(value) =>
                  handleEmployeeHoursChange(employee.id, value)
                }
                value={
                  employeeHours
                    .find((eh) => eh.employeeId === employee.id)
                    ?.hours?.toString() || ""
                }
              />
            </View>
          </View>
        ))}
      </View>

      {/* Bouton de mise à jour */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Icon name="check" size={24} color="#FFF" />
        <Text style={styles.updateButtonText}>Mettre à jour la prestation</Text>
      </TouchableOpacity>
    </ScrollView>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  customerSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  customerSelected: {
    fontSize: 16,
    color: "#333",
  },
  customerPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  serviceContainer: {
    marginBottom: 8,
  },
  serviceButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  serviceButtonSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  serviceButtonText: {
    fontSize: 16,
    color: "#333",
  },
  serviceButtonTextSelected: {
    color: "#2196F3",
    fontWeight: "500",
  },
  subServiceButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginLeft: 24,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  subServiceButtonSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  subServiceButtonText: {
    fontSize: 14,
    color: "#666",
  },
  subServiceButtonTextSelected: {
    color: "#2196F3",
    fontWeight: "500",
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  hoursContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
  },
  hoursInput: {
    fontSize: 16,
    textAlign: "center",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EditInvoice;
