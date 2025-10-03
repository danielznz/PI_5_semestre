import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../lib/firebaseConfig"; // importa o auth também

export default function DefinirHorario() {
  const [data, setData] = useState("");   // formato dd/mm/aaaa
  const [hora, setHora] = useState("");   // formato HH:mm
  const [loading, setLoading] = useState(false);

  const salvarHorario = async () => {
    if (!data || !hora) {
      alert("Preencha data e hora!");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado!");
        return;
      }

      // Busca dados do barbeiro logado
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("Dados do barbeiro não encontrados!");
        return;
      }

      const dadosBarbeiro = userSnap.data();

      // Converte strings em partes (dd/mm/yyyy e hh:mm)
      const [dia, mes, ano] = data.split("/");
      const [h, m] = hora.split(":");
      const date = new Date(+ano, +mes - 1, +dia, +h, +m);

      // 🔥 Agora salva a data e hora separadas também (dd/mm/yyyy e HH:mm)
      await addDoc(collection(db, "horarios"), {
        barbeiro: dadosBarbeiro.nome,
        data: `${dia}/${mes}/${ano}`,  // 👈 salvo em dd/mm/yyyy
        hora: `${h.padStart(2, "0")}:${m.padStart(2, "0")}`, // 👈 salvo em HH:mm
        disponibilidade: true,
      });

      alert("✅ Horário adicionado!");
      setData("");
      setHora("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar horário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Definir Horário</Text>

      <Text>Data (dd/mm/aaaa):</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="Ex: 05/10/2025"
      />

      <Text>Hora (HH:mm):</Text>
      <TextInput
        style={styles.input}
        value={hora}
        onChangeText={setHora}
        placeholder="Ex: 14:30"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={salvarHorario}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Adicionar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#dfe6e9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0a3d91",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
