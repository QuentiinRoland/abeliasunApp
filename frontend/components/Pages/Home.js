// src/screens/Home.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const Home = ({ navigation }) => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = Dimensions.get("window");

  const API_KEY = "fd6f91319ae9804d76ca8f38c9f4ffba";

  https: useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=50.8503&lon=4.3517&units=metric&lang=fr&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather({
        location: "Bruxelles, Belgique",
        temperature: `${Math.round(data.main.temp)}°C`,
        condition: data.weather[0].description,
        humidity: `${data.main.humidity}%`,
        precipitation: data.rain ? `${data.rain["1h"]}mm` : "0mm",
        pressure: `${data.main.pressure} hPa`,
        wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la météo:", error);
    } finally {
      setLoading(false);
    }
  };

  const carouselItems = [
    { id: "2", title: "Employés", screen: "Employés", icon: "👥" },
    { id: "3", title: "Clients", screen: "Clients", icon: "🤝" },
    { id: "4", title: "Factures", screen: "Factures", icon: "📄" },
  ];

  const notifications = [
    { id: "1", text: "3 factures en retard de validation" },
    { id: "2", text: "2 employés absents aujourd'hui" },
    { id: "3", text: "Nouveau client ajouté hier : Jean Dupont" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            Bonjour,{" "}
            {user?.displayName || user?.email?.split("@")[0] || "Utilisateur"}{" "}
            👋
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profilePic}
          onPress={() =>
            navigation.navigate("Compte", { screen: "AccountPage" })
          }
        >
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
              onError={(e) =>
                console.log(
                  "Erreur de chargement de l'image:",
                  e.nativeEvent.error
                )
              }
            />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>
                {(user?.displayName || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {weather && (
        <View style={styles.weatherWidget}>
          <Text style={styles.weatherLocation}>{weather.location}</Text>
          <View style={styles.weatherMain}>
            <View style={styles.weatherTempContainer}>
              <Text style={styles.weatherTemperature}>
                {weather.temperature}
              </Text>
              <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
            {weather.icon && (
              <Image
                source={{
                  uri: `http://openweathermap.org/img/w/${weather.icon}.png`,
                }}
                style={styles.weatherIcon}
              />
            )}
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetailItem}>
              <Text style={styles.weatherDetailLabel}>Humidité</Text>
              <Text style={styles.weatherDetailValue}>{weather.humidity}</Text>
            </View>
            <View style={styles.weatherDetailItem}>
              <Text style={styles.weatherDetailLabel}>Précipitations</Text>
              <Text style={styles.weatherDetailValue}>
                {weather.precipitation}
              </Text>
            </View>
            <View style={styles.weatherDetailItem}>
              <Text style={styles.weatherDetailLabel}>Vent</Text>
              <Text style={styles.weatherDetailValue}>{weather.wind}</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.carouselTitle}>Navigation rapide</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {carouselItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.carouselItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.carouselIcon}>{item.icon}</Text>
            <Text style={styles.carouselText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* 
      <View style={styles.notificationsSection}>
        <Text style={styles.notificationsTitle}>Rappels</Text>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{notification.text}</Text>
          </View>
        ))}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  weatherWidget: {
    margin: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  weatherMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  weatherTempContainer: {
    flex: 1,
  },
  weatherTemperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  weatherCondition: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  weatherIcon: {
    width: 60,
    height: 60,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  weatherDetailItem: {
    flex: 1,
    minWidth: "33%",
    marginBottom: 10,
  },
  weatherDetailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  weatherDetailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginBottom: 15,
  },
  carousel: {
    paddingLeft: 20,
  },
  carouselItem: {
    backgroundColor: "#ffffff",
    width: 120,
    height: 120,
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carouselIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  carouselText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  notificationsSection: {
    margin: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationText: {
    fontSize: 14,
    color: "#666",
  },
});

export default Home;
