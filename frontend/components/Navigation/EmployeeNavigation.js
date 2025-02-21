import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Employee from "../Pages/Employee/EmployeeForm";
import EmployeeListing from "../Pages/Employee/EmployeeListing";
import EmployeeDetails from "../Pages/Employee/EmployeeDetails";
import EditEmployee from "../Pages/Employee/EditingEmployee";

const Stack = createStackNavigator();

export const EmployeeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#ffffff",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        // headerRight: () => (
        //   <TouchableOpacity
        //     style={styles.headerRightButton}
        //     onPress={() => navigation.navigate("EmployeeAdd")}
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
        name="EmployeeListing"
        component={EmployeeListing}
        options={{
          title: "Liste des Employés",
        }}
      />
      <Stack.Screen
        name="EmployeeAdd"
        component={Employee}
        options={{
          title: "Créer un Employé",
        }}
      />
      <Stack.Screen
        name="EmployeeDetails"
        component={EmployeeDetails}
        options={{
          title: "Détails de l'Employé",
        }}
      />
      <Stack.Screen
        name="EditEmployee"
        component={EditEmployee}
        options={{
          title: "Modifier l'Employé",
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
