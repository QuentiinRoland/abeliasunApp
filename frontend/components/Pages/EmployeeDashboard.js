import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getEmployees } from "../../services/apiEmployee";
import axios from "axios";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedView]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const employeesData = await getEmployees();

      const startDate = getStartDate();
      const endDate = getEndDate();

      const hoursResponse = await axios.get(
        `https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/invoice-employees/hours`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );

      setEmployees(employeesData);
      setWorkingHours(hoursResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const date = new Date(selectedDate);
    switch (selectedView) {
      case "day":
        return new Date(date.setHours(0, 0, 0, 0));
      case "week":
        const dayOfWeek = date.getDay();
        return new Date(date.setDate(date.getDate() - dayOfWeek));
      case "month":
        return new Date(date.getFullYear(), date.getMonth(), 1);
      default:
        return date;
    }
  };

  const getEndDate = () => {
    const date = new Date(selectedDate);
    switch (selectedView) {
      case "day":
        return new Date(date.setHours(23, 59, 59, 999));
      case "week":
        const dayOfWeek = date.getDay();
        return new Date(date.setDate(date.getDate() - dayOfWeek + 6));
      case "month":
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
      default:
        return date;
    }
  };

  const renderViewSelector = () => (
    <View style={styles.viewSelector}>
      <TouchableOpacity
        style={[
          styles.viewButton,
          selectedView === "day" && styles.selectedView,
        ]}
        onPress={() => setSelectedView("day")}
      >
        <Text
          style={[
            styles.viewButtonText,
            selectedView === "day" && styles.selectedViewText,
          ]}
        >
          Jour
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.viewButton,
          selectedView === "week" && styles.selectedView,
        ]}
        onPress={() => setSelectedView("week")}
      >
        <Text
          style={[
            styles.viewButtonText,
            selectedView === "week" && styles.selectedViewText,
          ]}
        >
          Semaine
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.viewButton,
          selectedView === "month" && styles.selectedView,
        ]}
        onPress={() => setSelectedView("month")}
      >
        <Text
          style={[
            styles.viewButtonText,
            selectedView === "month" && styles.selectedViewText,
          ]}
        >
          Mois
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDateNavigator = () => (
    <View style={styles.dateNavigator}>
      <TouchableOpacity onPress={() => navigateDate("prev")}>
        <Text style={styles.navigationButton}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{formatDate()}</Text>
      <TouchableOpacity onPress={() => navigateDate("next")}>
        <Text style={styles.navigationButton}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    switch (selectedView) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
    }
    setSelectedDate(newDate);
  };

  const formatDate = () => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    switch (selectedView) {
      case "day":
        return selectedDate.toLocaleDateString("fr-FR", options);
      case "week":
        const startOfWeek = getStartDate();
        const endOfWeek = getEndDate();
        return `${startOfWeek.toLocaleDateString(
          "fr-FR"
        )} - ${endOfWeek.toLocaleDateString("fr-FR")}`;
      case "month":
        return selectedDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });
      default:
        return selectedDate.toLocaleDateString("fr-FR");
    }
  };

  const renderEmployeeHours = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#007BFF" />;
    }

    return (
      <ScrollView style={styles.employeeList}>
        {employees.map((employee) => {
          const employeeHours = workingHours.filter(
            (h) => h.EmployeeId === employee.id
          );

          const totalHours = employeeHours.reduce((sum, h) => sum + h.hours, 0);

          return (
            <View key={employee.id} style={styles.employeeCard}>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeHours}>
                {totalHours.toFixed(1)} heures
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heures Travaillées</Text>
      {renderViewSelector()}
      {renderDateNavigator()}
      {renderEmployeeHours()}
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
    textAlign: "center",
  },
  viewSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedView: {
    backgroundColor: "#007BFF",
  },
  viewButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  selectedViewText: {
    color: "#fff",
  },
  dateNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  navigationButton: {
    fontSize: 24,
    color: "#007BFF",
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
  },
  employeeList: {
    flex: 1,
  },
  employeeCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  employeeHours: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default EmployeeDashboard;
