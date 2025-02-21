import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmployeeNavigation } from "./EmployeeNavigation";
import InvoiceNavigation from "./InvoiceNavigation";
import AccountNavigator from "./AccountNavigation";
import CustomerNavigation from "./CustomerNavigation";
import Home from "../Pages/Home";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          marginHorizontal: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "#b0b0b0",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clients"
        component={CustomerNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Prestation"
        component={InvoiceNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="file-document"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Employés"
        component={EmployeeNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Compte"
        children={() => <AccountNavigator onLogout={onLogout} />}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
