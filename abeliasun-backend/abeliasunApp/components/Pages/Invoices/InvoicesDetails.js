import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getInvoiceById } from "../../../services/apiInvoices";
import { deleteInvoice } from "../../../services/apiInvoices";
import { generateInvoicePDF, sharePDF } from "./generateInvoicesPDF";
import { sendInvoiceEmail } from "../../../services/emailService";

const InvoiceDetails = ({ route, navigation }) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(invoiceId);
        // Format de la date en français
        if (data.date) {
          const date = new Date(data.date);
          data.formattedDate = date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        setInvoice(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la facture :", error);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleDeleteInvoice = async () => {
    try {
      await deleteInvoice(invoice.id);
      navigation.navigate("InvoicesListing");
    } catch (error) {
      console.error("Erreur", error);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfPath = await generateInvoicePDF(invoice);
      await sharePDF(pdfPath);
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert(
        "Erreur",
        "Impossible de générer le PDF. Veuillez réessayer plus tard."
      );
    }
  };

  const handleSendEmail = async () => {
    try {
      // Vérifier si le client a un email
      if (!invoice.customer?.email) {
        Alert.alert(
          "Erreur",
          "Aucune adresse email n'est associée à ce client."
        );
        return;
      }

      // Afficher un indicateur de chargement
      setLoading(true);

      // Générer le PDF
      const pdfUri = await generateInvoicePDF(invoice);

      // Envoyer l'email
      await sendInvoiceEmail(invoice, pdfUri);

      // Afficher une confirmation
      Alert.alert(
        "Succès",
        "La facture a été envoyée par email avec succès !",
        [
          {
            text: "OK",
            onPress: () => console.log("Email envoyé avec succès"),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      Alert.alert(
        "Erreur",
        "Impossible d'envoyer l'email. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>Chargement des informations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête de la facture */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={styles.invoiceNumber}>
            Facture #{invoice.numberInvoice}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{invoice.progress || 0}%</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon name="event" size={20} color="#666" />
          <Text style={styles.infoText}>{invoice.formattedDate}</Text>
        </View>
      </View>

      {/* Informations client */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Client</Text>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color="#666" />
          <Text style={styles.infoText}>
            {invoice.customer ? invoice.customer.name : "Non spécifié"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="email" size={20} color="#666" />
          <Text style={styles.infoText}>
            {invoice.customer ? invoice.customer.email : "Non spécifié"}
          </Text>
        </View>
      </View>

      {/* Signature */}
      {invoice.tagline && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Signature</Text>
          <Image
            source={{ uri: invoice.tagline }}
            style={styles.signatureImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Services */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Services</Text>
        {invoice.associatedServices && invoice.associatedServices.length > 0 ? (
          invoice.associatedServices.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceHeader}>
                <Icon name="build" size={20} color="#666" />
                <Text style={styles.serviceName}>{service.name}</Text>
              </View>
              {invoice.selectedSubServices &&
                invoice.selectedSubServices.length > 0 && (
                  <View style={styles.subServicesContainer}>
                    {invoice.selectedSubServices
                      .filter(
                        (subService) => subService.serviceId === service.id
                      )
                      .map((subService, subIndex) => (
                        <View key={subIndex} style={styles.subServiceItem}>
                          <Icon
                            name="subdirectory-arrow-right"
                            size={18}
                            color="#999"
                          />
                          <Text style={styles.subServiceName}>
                            {subService.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun service associé</Text>
        )}
      </View>

      {/* Employés */}
      {invoice.employees && invoice.employees.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Employés</Text>
          {invoice.employees.map((employee, index) => (
            <View key={index} style={styles.employeeItem}>
              <View style={styles.employeeInfo}>
                <Icon name="person" size={20} color="#666" />
                <Text style={styles.employeeName}>{employee.name}</Text>
              </View>
              <View style={styles.hoursContainer}>
                <Icon name="schedule" size={18} color="#666" />
                <Text style={styles.hoursText}>
                  {employee.InvoiceEmployee?.hours || 0}h
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Photos */}
      {invoice.pictures && invoice.pictures.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Photos</Text>
          <View style={styles.picturesGrid}>
            {invoice.pictures.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.pictureImage}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate("EditInvoice", { invoice })}
        >
          <Icon name="edit" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Modifier la préstation</Text>
        </TouchableOpacity>

        <View style={styles.pdfButtonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.pdfButton]}
            onPress={handleGeneratePDF}
          >
            <Icon name="picture-as-pdf" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Télécharger PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={handleSendEmail}
          >
            <Icon name="email" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Envoyer par email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleDeleteInvoice}
          >
            <Icon name="delete" size={20} color="#fff" />
            <Text style={styles.buttonText}>Supprimer la préstation</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerCard: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    margin: 12,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
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
  signatureImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
  subServicesContainer: {
    marginLeft: 32,
    marginTop: 8,
  },
  subServiceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subServiceName: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  picturesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pictureImage: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  actionButtons: {
    padding: 12,
    paddingBottom: 80, // Augmenté pour éviter la navigation
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  pdfButton: {
    backgroundColor: "#FF5722",
    marginBottom: 0, // Dernier bouton sans marge
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  pdfButtonsContainer: {
    gap: 8,
  },
  emailButton: {
    backgroundColor: "#4CAF50",
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
  },
  loading: {
    fontSize: 16,
    color: "#666",
  },
});

export default InvoiceDetails;
