import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Service from "../Pages/Services/ServicesForm";
import { ServicesListing } from "../Pages/Services/ServicesListing";

const Stack = createStackNavigator();
export const ServicesNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServicesListing"
        options={{ title: "Liste des services" }}
        component={ServicesListing}
      ></Stack.Screen>
      <Stack.Screen
        name="ServicesAdd"
        options={{ title: "Création d'un service" }}
        component={Service}
      ></Stack.Screen>
      <Stack.Screen
        name="Add"
        options={{ title: "Création d'un service" }}
        component={Service}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
