import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bem-vindo à Tríade Barbearia!</Text>
      <Text style={styles.subtitle}>Escolha um de nossos serviços:</Text>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Agendar Horário</Text>
        <Text style={styles.cardSubtitle}>Agende seu horário com facilidade</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Histórico de Agendamentos</Text>
        <Text style={styles.cardSubtitle}>Gerencie e avalie seus agendamentos passados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
  },
});
