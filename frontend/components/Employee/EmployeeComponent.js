import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const EmployeeHours = ({ employees, onAddEmployee }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");

  const handleAdd = () => {
    if (!selectedEmployee || !hoursWorked || isNaN(hoursWorked)) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner un employé et indiquer des heures valides."
      );
      return;
    }
    onAddEmployee({
      id: parseInt(selectedEmployee, 10),
      hours: parseFloat(hoursWorked),
    });
    setSelectedEmployee("");
    setHoursWorked("");
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ajouter des heures par employé</Text>
      <TextInput
        style={styles.input}
        placeholder="ID de l'employé"
        value={selectedEmployee}
        onChangeText={setSelectedEmployee}
      />
      <TextInput
        style={styles.input}
        placeholder="Heures travaillées"
        value={hoursWorked}
        onChangeText={setHoursWorked}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});

export default EmployeeHours;
