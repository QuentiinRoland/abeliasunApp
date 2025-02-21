import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountPage from "../Pages/Account";
import UserManagement from "../Pages/UserManagement";
import EmployeeDashboard from "../Pages/EmployeeDashboard";

const Stack = createStackNavigator();

const AccountNavigator = ({ onLogout }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Cache l'en-tête par défaut
      }}
    >
      <Stack.Screen
        name="AccountPage"
        children={() => <AccountPage onLogout={onLogout} />}
      />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
