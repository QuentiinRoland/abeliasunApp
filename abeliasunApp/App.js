import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import AuthNavigator from "./components/Navigation/AuthNavigation";
import TabNavigator from "./components/Navigation/Navigation";
import { AuthProvider, AuthContext } from "./components/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainApp() {
  const { user, loading, handleLogout } = useContext(AuthContext);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? <TabNavigator onLogout={handleLogout} /> : <AuthNavigator />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
