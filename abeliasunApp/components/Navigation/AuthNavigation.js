import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";

const Stack = createStackNavigator();

const AuthNavigator = ({ onLogin }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        children={() => <LoginPage onLogin={onLogin} />}
      />
      <Stack.Screen name="Register" component={RegisterPage} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
