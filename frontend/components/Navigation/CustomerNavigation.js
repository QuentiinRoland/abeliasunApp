import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, StyleSheet } from "react-native";
import CustomerListing from "../Pages/Customers/CustomerListing";
import Customer from "../Pages/Customers/CustomerForm";
import CustomerDetails from "../Pages/Customers/CustomerDetails";
import EditCustomer from "../Pages/Customers/EditingCustomer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const CustomerNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#ffffff",
          shadowColor: "transparent", // Supprime l'ombre
          elevation: 0,
          borderBottomLeftRadius: 20, // Arrondi des coins inférieurs
          borderBottomRightRadius: 20,
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTitleAlign: "center", // Centre le titre
        headerBackTitleVisible: false, // Cache le texte du bouton "Retour"
        // headerRight: () => (
        //   <TouchableOpacity
        //     style={styles.headerRightButton}
        //     onPress={() => navigation.navigate("CustomerAdd")}
        //   >
        //     <MaterialCommunityIcons name="plus" size={24} color="green" />
        //   </TouchableOpacity>
        // ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerLeftButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="CustomerListing"
        component={CustomerListing}
        options={{
          title: "Liste des Clients",
        }}
      />
      <Stack.Screen
        name="CustomerAdd"
        component={Customer}
        options={{
          title: "Créer un Client",
        }}
      />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={{
          title: "Détails du Client",
        }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomer}
        options={{
          title: "Modifier le Client",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: "#E9F5EC",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLeftButton: {
    marginLeft: 15,
  },
});

export default CustomerNavigation;
