import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CadastrarServico() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");

  const salvarServico = async () => {
  if (!nome || !categoria || !preco || !descricao) {
    alert("⚠️ Preencha todos os campos!");
    return;
  }

  try {
    await addDoc(collection(db, "servicos"), {
      nome,
      categoria,
      preco: parseFloat(preco), // 🔥 salva como número
      descricao,
      barbeiro: "Igor", // <- aqui você coloca dinamicamente o barbeiro logado
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
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Cadastrar Serviços</Text>

        {/* Campos */}
        <Text style={styles.label}>Nome do Serviço:</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: Coloração de cabelo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Categoria do Serviço:</Text>
        <TextInput
          style={styles.input}
          placeholder="Exemplo: Cabelo"
          placeholderTextColor="#999"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.label}>Preço:</Text>
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
          placeholder="Exemplo: Descoloração feita com produtos especializados..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarServico}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>

        {/* Botão Gerenciar */}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => router.push("/barbeiro/gerenciar")}
        >
          <Text style={styles.manageText}>Gerencie seus serviços</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        backgroundColor: "#003087", // Azul
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
        backgroundColor: "#aaa", // Cinza
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
