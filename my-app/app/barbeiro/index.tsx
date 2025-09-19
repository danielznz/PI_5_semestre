import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BarbeiroDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header customizado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          Bem-vindo, <Text style={styles.span}>Barbeiro!</Text>
        </Text>
        <Text style={styles.subtitle}>Gerencie suas funções abaixo:</Text>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/hairstyle.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Cadastrar Serviços</Text>
          <Text style={styles.cardSubtitle}>Adicione novos serviços disponíveis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/time.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Definir Horários</Text>
          <Text style={styles.cardSubtitle}>Gerencie seus horários de trabalho</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/checklist.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Ver Agendamentos</Text>
          <Text style={styles.cardSubtitle}>Acompanhe os agendamentos marcados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/statistics.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Suas Estatisticas</Text>
          <Text style={styles.cardSubtitle}>Veja seus Resultados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: "#f2f2f2",
  },
  backButton: {
    marginRight: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    marginBottom: 5,
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#00367c",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#ccc",
  },
  imgcard: {
    height: 35,
    width: 35,
    resizeMode: "cover",
  },
  span: {
    textTransform: "uppercase",
    color: "#00367c",
    fontWeight: "bold",
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00367c",
    marginBottom: 10,
  },
});
