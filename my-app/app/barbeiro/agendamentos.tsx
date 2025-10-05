import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AgendamentosAdm() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const ref = collection(db, "agendamentos");
        // pega todos os docs sem filtro
        const snap = await getDocs(ref);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAgendamentos(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, []);



  const handleCancelar = (id: string) => {
    Alert.alert(
      "Cancelar Agendamento",
      "Deseja realmente cancelar este agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "agendamentos", id));
              setAgendamentos((prev) => prev.filter((a) => a.id !== id));
              Alert.alert("Sucesso", "Agendamento cancelado!");
            } catch (err) {
              console.error("Erro ao cancelar:", err);
              Alert.alert("Erro", "Não foi possível cancelar.");
            }
          },
        },
      ]
    );
  };

  const handleConfirmar = async (id: string) => {
    try {
      await updateDoc(doc(db, "agendamentos", id), {
        status: "concluido",
      });
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "concluido" } : a))
      );
      Alert.alert("Sucesso", "Agendamento confirmado como concluído!");
    } catch (err) {
      console.error("Erro ao confirmar:", err);
      Alert.alert("Erro", "Não foi possível confirmar.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
          <Text style={styles.headerTitle}>Agendamentos</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {agendamentos.length === 0 ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
              Nenhum agendamento encontrado
            </Text>
          ) : (
            agendamentos.map((a) => (
              <View key={a.id} style={styles.card}>
                <Text style={styles.date}>
                  {a.data} - {a.hora}h
                </Text>
                <Text style={styles.email}>{a.emailcliente}</Text>

                <View style={styles.actions}>
                  {a.status === "concluido" ? (
                    <Text style={styles.concluido}>✅ Concluído</Text>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => handleCancelar(a.id)}
                      >
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={() => handleConfirmar(a.id)}
                      >
                        <Text style={styles.confirmText}>Confirmar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    color: "#000",
    textAlign: "center",
    marginTop: 50,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    fontSize: 14,
    marginTop: 4,
    color: "#444",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#005a26ff",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
  concluido: {
    color: "#005a26ff",
    fontWeight: "bold",
  },
});
