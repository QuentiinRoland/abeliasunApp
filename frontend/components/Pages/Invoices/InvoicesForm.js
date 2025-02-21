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
import EmployeeHours from "../../Employee/EmployeeComponent";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ModernInvoiceForm = ({ navigation, route }) => {
  const { fetchInvoices } = route.params;
  const [loading, setLoading] = useState(true);
  const [selectedPictures, setSelectedPictures] = useState([]);
  const [tagline, setTagline] = useState(null);
  const [signatureRef, setSignatureRef] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [selectedSubServices, setSelectedSubServices] = useState({});
  const [employeeHours, setEmployeeHours] = useState([]);
  const [numberInvoice, setNumberInvoice] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (fetchInvoices) {
      navigation.setOptions({ fetchInvoices });
    }
  }, [fetchInvoices, navigation]);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`; // Format YYYY-MM-DD
      setDate(formatted);
      setFormattedDate(formatted);
    }
  };

  const handleSignature = (signature) => {
    // La signature est déjà en base64, nous pouvons la stocker directement
    console.log(
      "Signature reçue:",
      signature ? signature.substring(0, 50) + "..." : "null"
    );
    setTagline(signature);
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setSelectedPictures((prev) => [
        ...prev,
        ...result.assets.map((a) => a.uri),
      ]);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de votre autorisation pour accéder à la caméra."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedPictures((prev) => [...prev, result.uri]);
    }
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
      } else {
        return [...prevHours, { employeeId, hours: numericHours }];
      }
    });
  };

  const handleSubmit = async () => {
    if (!date || !numberInvoice || !customerId) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    const invoiceData = {
      date,
      numberInvoice,
      customerId,
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
      const response = await fetch(
        "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/invoices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la prestation");
      }

      const responseData = await response.json();

      // Récupération de `fetchInvoices` depuis les options
      const fetchInvoicesFromOptions =
        navigation.getState().routes[0]?.params?.fetchInvoices;

      if (fetchInvoicesFromOptions) {
        await fetchInvoicesFromOptions(); // Appel à la fonction via les options
      }

      Alert.alert("Succès", "Prestation créée avec succès !", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("InvoiceDetails", {
              invoiceId: responseData.id,
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur:", error.message);
      Alert.alert("Erreur", "Impossible de créer la prestation.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Créer une prestation</Text>
      </View>

      {/* Informations générales */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="info" size={20} color="#666" style={styles.icon} />
          Informations générales
        </Text>
        <View style={styles.inputContainer}>
          <Icon name="event" size={20} color="#999" />
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowPicker(true)} // Active le picker lorsqu'on appuie
          >
            <Text style={styles.dateText}>
              {formattedDate || "Sélectionner une date"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={new Date(date)} // Utiliser la date sélectionnée
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="receipt" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Numéro de prestation"
            value={numberInvoice}
            onChangeText={setNumberInvoice}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#999" />
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
                customerId
                  ? styles.customerSelected
                  : styles.customerPlaceholder
              }
            >
              {customerId
                ? customers.find((c) => c.id.toString() === customerId)?.name
                : "Sélectionner un client"}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#999" />
          </TouchableOpacity>
        </View>
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
              {selectedServices[service.id] && (
                <Icon name="check" size={20} color="#FFF" />
              )}
            </TouchableOpacity>

            {/* Afficher les sous-services */}
            {selectedServices[service.id] &&
              service.subservices?.map((subService, index) => (
                <TouchableOpacity
                  key={index} // Assurez-vous d'utiliser une clé unique pour chaque sous-service
                  onPress={() => toggleSubService(subService.id)}
                  style={[
                    styles.subServiceButton,
                    selectedSubServices[subService.id] &&
                      styles.subServiceButtonSelected,
                  ]}
                >
                  <Icon
                    name="subdirectory-arrow-right"
                    size={20}
                    color={
                      selectedSubServices[subService.id] ? "#2196F3" : "#999"
                    }
                  />
                  <Text
                    style={[
                      styles.subServiceButtonText,
                      selectedSubServices[subService.id] &&
                        styles.subServiceButtonTextSelected,
                    ]}
                  >
                    {subService.name || `Sous-service ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </View>

      {/* Employés */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="people" size={20} color="#666" style={styles.icon} />
          Heures par Employé
        </Text>
        {employees.map((employee) => (
          <View key={employee.id} style={styles.employeeRow}>
            <View style={styles.employeeInfo}>
              <Icon name="person" size={20} color="#666" />
              <Text style={styles.employeeName}>{employee.name}</Text>
            </View>
            <View style={styles.hoursContainer}>
              <Icon name="schedule" size={20} color="#666" />
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

      {/* Images */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon
            name="photo-library"
            size={20}
            color="#666"
            style={styles.icon}
          />
          Images
        </Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
            <Icon name="photo-library" size={24} color="#FFF" />
            <Text style={styles.imageButtonText}>Ajouter des images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
            <Icon name="camera-alt" size={24} color="#FFF" />
            <Text style={styles.imageButtonText}>Prendre une photo</Text>
          </TouchableOpacity>
        </View>
        {selectedPictures.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
          >
            {selectedPictures.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteImageButton}
                  onPress={() =>
                    setSelectedPictures((pics) =>
                      pics.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Icon name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Signature */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Icon name="draw" size={20} color="#666" style={styles.icon} />
          Signature
        </Text>
        <View style={styles.signatureContainer}>
          <Signature
            ref={setSignatureRef}
            onOK={handleSignature}
            webStyle={`
              .m-signature-pad { width: 100%; height: 100%; }
              .m-signature-pad--body { border-radius: 8px; }
            `}
            backgroundColor="white"
          />
        </View>
        <View style={styles.signatureButtons}>
          <TouchableOpacity
            style={[styles.signatureButton, styles.clearButton]}
            onPress={() => signatureRef?.clearSignature()}
          >
            <Icon name="delete" size={20} color="#FFF" />
            <Text style={styles.signatureButtonText}>Effacer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.signatureButton, styles.confirmButton]}
            onPress={() => signatureRef?.readSignature()}
          >
            <Icon name="check" size={20} color="#FFF" />
            <Text style={styles.signatureButtonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton de soumission */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Icon name="check-circle" size={24} color="#FFF" />
        <Text style={styles.submitButtonText}>Créer la prestation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  customerSelector: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceButtonSelected: {
    backgroundColor: "#2196F3",
  },
  serviceButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  serviceButtonTextSelected: {
    color: "#FFF",
  },
  subServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    marginLeft: 24,
    marginBottom: 8,
  },
  subServiceButtonSelected: {
    backgroundColor: "#E3F2FD",
  },
  subServiceButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
  },
  hoursInput: {
    width: 60,
    textAlign: "center",
    fontSize: 16,
    marginLeft: 8,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  imageButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  imageScroll: {
    flexDirection: "row",
    marginTop: 12,
  },
  imageWrapper: {
    marginRight: 12,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF5252",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  signatureContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 16,
  },
  signatureButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: "#FF5252",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  signatureButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ModernInvoiceForm;
