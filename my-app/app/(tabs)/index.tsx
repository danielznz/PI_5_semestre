import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const [exitModalVisible, setExitModalVisible] = useState(false);

  return (
    <View style={styles.container}>

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal visible={exitModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Deseja sair?</Text>
            <Text style={styles.modalMessage}>Você voltará para a tela anterior.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#2b2b2b" }]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#dc3545" }]}
                onPress={() => router.back()}
              >
                <Text style={styles.modalBtnText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setExitModalVisible(true)} style={styles.backButton}>
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

        <TouchableOpacity style={styles.card} onPress={() => router.push("./historico")}>
          <View style={styles.circleContainer}>
            <Image
              source={require("../../assets/images/historico.png")}
              style={styles.imgcard}
            />
          </View>
          <Text style={styles.cardTitle}>Histórico e Avaliações</Text>
          <Text style={styles.cardSubtitle}>Gerencie seus agendamentos</Text>
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

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#2b2b2b",
    padding: 25,
    borderRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#d5a759",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d5a759",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    width: "48%",
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalBtnText: {
    color: "#f2f2f2",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* RESTANTE */
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
