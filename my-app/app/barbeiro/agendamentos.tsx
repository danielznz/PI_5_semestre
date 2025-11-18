import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AgendamentosAdm() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("Nenhum barbeiro logado.");
      setLoading(false);
      return;
    }

    // ✅ escuta em tempo real os agendamentos do barbeiro logado (pelo email)
    const ref = collection(db, "agendamentos");
    const q = query(ref, where("barbeiro", "==", user.email));

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setAgendamentos(data);
      setLoading(false);
    });

    // encerra listener ao desmontar o componente
    return () => unsubscribe();
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
              Alert.alert("✅ Sucesso", "Agendamento cancelado!");
            } catch (err) {
              console.error("Erro ao cancelar:", err);
              Alert.alert("❌ Erro", "Não foi possível cancelar.");
            }
          },
        },
      ]
    );
  };

  const handleConfirmar = async (id: string) => {
    try {
      await updateDoc(doc(db, "agendamentos", id), { status: "concluido" });
      Alert.alert("✅ Sucesso", "Agendamento marcado como concluído!");
    } catch (err) {
      console.error("Erro ao confirmar:", err);
      Alert.alert("❌ Erro", "Não foi possível confirmar.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#d5a759" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {agendamentos.length === 0 ? (
            <Text style={styles.empty}>Nenhum agendamento encontrado.</Text>
          ) : (
            agendamentos
              .sort((a, b) => (a.data > b.data ? 1 : -1))
              .map((a) => (
                <View key={a.id} style={styles.card}>
                  <Text style={styles.date}>
                    📅 {a.data} — {a.hora}
                  </Text>
                  <Text style={styles.service}>
                    💈 {a.servico} — R$ {a.preco}
                  </Text>
                  <Text style={styles.email}>👤 {a.nomecliente}</Text>
                  <Text style={styles.email}>📞 {a.telefonecliente}</Text>
                  <Text style={styles.email}>✉️ {a.emailcliente}</Text>


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
                          <Text style={styles.confirmText}>Concluir</Text>
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
    color: "#f2f2f2",
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
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 60,
  },
  empty: {
    color: "#f2f2f2",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#2b2b2b",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  date: {
    color: "#f2f2f2",
    fontWeight: "bold",
    fontSize: 16,
  },
  service: {
    color: "#d5a759",
    marginTop: 4,
    fontSize: 15,
  },
  email: {
    color: "#ffffffff",
    marginTop: 4,
    fontSize: 14,
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
    backgroundColor: "#d5a759",
  },
  confirmText: {
    color: "#1b1b1b",
    fontWeight: "bold",
  },
  concluido: {
    color: "#2ecc71",
    fontWeight: "bold",
  },
});
