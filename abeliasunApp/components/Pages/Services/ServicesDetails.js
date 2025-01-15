import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getServiceById } from "../../../services/apiServices";

const ServicesDetails = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Erreur lors de la récup du client :", error);
      }
    };

    fetchService();
  }),
    [serviceId];

  return (
    <View style={styles.container}>
      {service ? (
        <>
          <Text style={styles.label}>Nom : {service.name}</Text>
          <Text style={styles.label}>Description : {service.description}</Text>
          <Text style={styles.label}>Prix : {service.pricing}</Text>

          <Button
            title="Modifier le service"
            onPress={() => navigation.navigate("EditService", { service })}
          />
        </>
      ) : (
        <Text style={styles.loading}>Chargement des informations...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ServicesDetails;
