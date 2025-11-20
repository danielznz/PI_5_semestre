import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BarbeiroDashboard() {
  const router = useRouter();

  const [exitModalVisible, setExitModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal visible={exitModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Deseja sair?</Text>
            <Text style={styles.modalMessage}>Você será redirecionado para a tela anterior.</Text>

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
          <TouchableOpacity
            onPress={() => setExitModalVisible(true)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>
          Bem-vindo, <Text style={styles.span}>Barbeiro!</Text>
        </Text>
        <Text style={styles.subtitle}>Gerencie suas funções abaixo:</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/barbeiro/cadastrar")}
        >
          <View style={styles.circleContainer}>
            <Image source={require("../../assets/images/hairstyle.png")} style={styles.imgcard} />
          </View>
          <Text style={styles.cardTitle}>Cadastrar Serviços</Text>
          <Text style={styles.cardSubtitle}>Adicione novos serviços disponíveis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/barbeiro/horario")}
        >
          <View style={styles.circleContainer}>
            <Image source={require("../../assets/images/time.png")} style={styles.imgcard} />
          </View>
          <Text style={styles.cardTitle}>Definir Horários</Text>
          <Text style={styles.cardSubtitle}>Gerencie seus horários de trabalho</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/barbeiro/agendamentos")}
        >
          <View style={styles.circleContainer}>
            <Image source={require("../../assets/images/checklist.png")} style={styles.imgcard} />
          </View>
          <Text style={styles.cardTitle}>Ver Agendamentos</Text>
          <Text style={styles.cardSubtitle}>Acompanhe os agendamentos marcados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/barbeiro/estatisticas")}
        >
          <View style={styles.circleContainer}>
            <Image source={require("../../assets/images/statistics.png")} style={styles.imgcard} />
          </View>
          <Text style={styles.cardTitle}>Suas Estatísticas</Text>
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

  /* ========== MODAL ========== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
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
