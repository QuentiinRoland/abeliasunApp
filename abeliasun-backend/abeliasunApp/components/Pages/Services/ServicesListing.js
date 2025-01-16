import React from "react";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { getServices } from "../../../services/apiServices";

export const ServicesListing = ({ navigation }) => {
  const [service, setService] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServices();
        setService(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, []);

  if (loading) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Services</Text>
      <Button
        title="Ajouter un service"
        onPress={() => navigation.navigate("ServicesAdd")}
      />
      <FlatList
        data={service}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Button
              title="Voir les détails"
              onPress={() =>
                navigation.navigate("ServicesDetails", { serviceId: item.id })
              }
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});

export default ServicesListing;
