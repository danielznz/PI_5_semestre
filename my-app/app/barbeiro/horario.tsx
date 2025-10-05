import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { addDoc, collection, getDoc, doc } from "firebase/firestore"
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db, auth } from "../lib/firebaseConfig"

export default function DefinirHorario() {
  const router = useRouter();
  const [data, setData] = useState("") // formato dd/mm/aaaa
  const [hora, setHora] = useState("") // formato HH:mm
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const salvarHorario = async () => {
    if (!data || !hora) {
      alert("Preencha data e hora!")
      return
    }

    try {
      setLoading(true)

      const user = auth.currentUser
      if (!user) {
        alert("Usuário não autenticado!")
        return
      }

      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        alert("Dados do barbeiro não encontrados!")
        return
      }

      const dadosBarbeiro = userSnap.data()
      const [dia, mes, ano] = data.split("/")
      const [h, m] = hora.split(":")

      await addDoc(collection(db, "horarios"), {
        barbeiro: dadosBarbeiro.nome,
        data: `${dia}/${mes}/${ano}`,
        hora: `${h.padStart(2, "0")}:${m.padStart(2, "0")}`,
        disponibilidade: true,
      })

      alert("✅ Horário adicionado!")
      setData("")
      setHora("")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar horário")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#333" />
        <Text style={styles.title}>Definir Horário</Text>
      </TouchableOpacity>



      <Text style={styles.label}>Data (dd/mm/aaaa):</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="Ex: 05/10/2025"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Hora (HH:mm):</Text>
      <TextInput
        style={styles.input}
        value={hora}
        onChangeText={setHora}
        placeholder="Ex: 14:30"
        keyboardType="numeric"
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4fa",
    justifyContent: "flex-start", // 👈 elementos no topo
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: "#0a3d91",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
