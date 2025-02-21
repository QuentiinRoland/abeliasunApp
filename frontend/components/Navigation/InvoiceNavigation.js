import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingInvoice from "../Pages/Invoices/InvoicesListing";
import InvoiceDetails from "../Pages/Invoices/InvoicesDetails";
import InvoiceForm from "../Pages/Invoices/InvoicesForm";
import EditInvoice from "../Pages/Invoices/EditingInvoices";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const InvoiceNavigation = () => {
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
        //     onPress={() => navigation.navigate("InvoiceForm")}
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
        name="InvoicesListing"
        component={ListingInvoice}
        options={{
          title: "Listes des prestations",
        }}
      />
      <Stack.Screen
        name="InvoiceForm"
        component={InvoiceForm}
        options={{
          title: "Créer une prestation",
        }}
      />
      <Stack.Screen
        name="InvoiceDetails"
        component={InvoiceDetails}
        options={{
          title: "Détails de la prestation",
        }}
      />
      <Stack.Screen
        name="EditInvoice"
        component={EditInvoice}
        options={{
          title: "Modifier la prestation",
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

export default InvoiceNavigation;
