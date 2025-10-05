import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db, auth } from "../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export default function CadastrarServico() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const salvarServico = async () => {
    if (!nome || !categoria || !preco || !descricao) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado!");
        return;
      }

      // 🔥 Buscar dados do barbeiro logado
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("Dados do barbeiro não encontrados!");
        return;
      }

      const dadosBarbeiro = userSnap.data();

      // 🔥 Salvar serviço vinculado ao UID do barbeiro
      await addDoc(collection(db, "servicos"), {
        nome,
        categoria,
        preco: parseFloat(preco),
        descricao,
        barbeiro: dadosBarbeiro.nome || "Desconhecido",
        barbeiroUid: user.uid, // <-- 🔑 vínculo único
        createdAt: serverTimestamp(),
      });

      alert("✅ Serviço cadastrado com sucesso!");
      setNome("");
      setCategoria("");
      setPreco("");
      setDescricao("");
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("❌ Erro ao salvar serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.title}>Cadastrar Serviços</Text>
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <Text style={styles.label}>Nome do Serviço:</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: Corte degradê"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Categoria:</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: Cabelo"
          placeholderTextColor="#999"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.label}>Preço (R$):</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: 50"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={preco}
          onChangeText={setPreco}
        />

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Exemplo: Corte com máquina e acabamento"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Botão salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarServico} disabled={loading}>
          <Text style={styles.saveText}>{loading ? "Salvando..." : "Salvar"}</Text>
        </TouchableOpacity>

        {/* Botão para gerenciar */}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => router.push("/barbeiro/gerenciar")}
        >
          <Text style={styles.manageText}>Gerenciar meus serviços</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4fa",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    fontSize: 16,
    color: "#000",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#003087",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  manageButton: {
    backgroundColor: "#aaa",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  manageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
