import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Componente de avaliação por estrelas
function RatingStars({ agendamentoId, currentRating }: { agendamentoId: string; currentRating?: number }) {
  const [rating, setRating] = useState(currentRating || 0);

  const handleRate = async (value: number) => {
    setRating(value);

    try {
      await updateDoc(doc(db, "agendamentos", agendamentoId), {
        avaliacao: value,
      });
      Alert.alert("Obrigado!", "Sua avaliação foi registrada.");
    } catch (err) {
      console.error("Erro ao salvar avaliação:", err);
      Alert.alert("Erro", "Não foi possível salvar a avaliação.");
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => handleRate(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={28}
            color="#d5a759"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HistoricoAgendamentos() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const ref = collection(db, "agendamentos");
        const q = query(ref, where("emailcliente", "==", user.email));

        const snap = await getDocs(q);
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

  const isConcluido = (data: string, hora: string) => {
    const [dia, mes, ano] = data.split("/").map(Number); // "25/09/2025"
    const [h, m] = hora.split(":").map(Number);
    const agendamentoDate = new Date(ano, mes - 1, dia, h, m);
    return agendamentoDate < new Date();
  };

  const handleCancelar = (id: string) => {
    Alert.alert(
      "Cancelar Agendamento",
      "Deseja realmente cancelar seu agendamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "agendamentos", id));
              setAgendamentos((prev) => prev.filter((a) => a.id !== id));
              Alert.alert("Sucesso", "Agendamento cancelado com sucesso!");
            } catch (err) {
              console.error("Erro ao cancelar agendamento:", err);
              Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Agendamentos</Text>
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
            agendamentos.map((a) => {
              const concluido = isConcluido(a.data, a.hora);
              return (
                <View key={a.id} style={styles.card}>
                  <Text style={styles.date}>
                    {a.data} - {a.hora}h
                  </Text>
                  <Text style={styles.barbeiro}>{a.barbeiro}</Text>

                  {concluido || a.status === "concluido" ? (
                    <View style={styles.footer}>
                      <RatingStars agendamentoId={a.id} currentRating={a.avaliacao} />
                      <Text style={styles.statusConcluido}>Concluído</Text>
                    </View>
                  ) : (
                    <View style={styles.footer}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelar(a.id)}
                      >
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>
                      <Text style={styles.statusAgendado}>Agendado</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  barbeiro: {
    fontSize: 15,
    marginTop: 4,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusAgendado: {
    color: "#d5a759",
    fontWeight: "bold",
  },
  statusConcluido: {
    color: "#ccc",
    fontWeight: "bold",
  },
});
