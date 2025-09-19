import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header customizado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          Bem-vindo à <Text style={styles.span}>Tríade!</Text>
        </Text>
        <Text style={styles.subtitle}>Escolha um de nossos serviços:</Text>

        <TouchableOpacity style={styles.card} onPress={() => router.push("./agendamento")}>
          <View style={styles.circleContainer}>
            <Image source={require("../../assets/images/agenda.png")} style={styles.imgcard} />
          </View>
          <Text style={styles.cardTitle}>Agendar Horário</Text>
          <Text style={styles.cardSubtitle}>Agende seu horário com facilidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/historico.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Histórico de Agendamentos</Text>
          <Text style={styles.cardSubtitle}>Gerencie seus agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/estrelas.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Avaliações</Text>
          <Text style={styles.cardSubtitle}>Avalie seus agendamentos passados</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1bff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: "#1b1b1bff",
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
    color: "#f2f2f2",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#333",
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
    color: "#d5a759",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#f2f2f2",
  },
  imgcard: {
    height: 35,
    width: 35,
    resizeMode: "cover",
  },
  span: {
    textTransform: "uppercase",
    color: "#d5a759",
    fontWeight: "bold",
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#1b1b1bff",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#d5a759",
    marginBottom: 10,
  },
});
