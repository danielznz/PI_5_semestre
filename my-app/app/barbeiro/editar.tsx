import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../lib/firebaseConfig"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

// 🔹 Tipagem do serviço
type Servico = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
};

export default function EditarServico() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // pega o ID da URL
  const [loading, setLoading] = useState(true);
  const [servico, setServico] = useState<Omit<Servico, "id">>({
    nome: "",
    categoria: "",
    preco: 0,
    descricao: "",
  });

  // 🔹 Buscar dados do serviço
  const carregarServico = async () => {
    try {
      const docRef = doc(db, "servicos", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setServico(docSnap.data() as Omit<Servico, "id">);
      } else {
        Alert.alert("Erro", "Serviço não encontrado.");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      Alert.alert("Erro", "Não foi possível carregar o serviço.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarServico();
  }, []);

  // 🔹 Salvar alterações
  const salvarAlteracoes = async () => {
    if (!servico.nome || !servico.categoria || !servico.preco || !servico.descricao) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const docRef = doc(db, "servicos", String(id));
      await updateDoc(docRef, {
        nome: servico.nome,
        categoria: servico.categoria,
        preco: Number(servico.preco),
        descricao: servico.descricao,
      });

      Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Serviço</Text>
      </View>

      {/* Formulário */}
      <TextInput
        style={styles.input}
        placeholder="Nome do serviço"
        value={servico.nome}
        onChangeText={(text) => setServico({ ...servico, nome: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={servico.categoria}
        onChangeText={(text) => setServico({ ...servico, categoria: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={String(servico.preco)}
        onChangeText={(text) => setServico({ ...servico, preco: parseFloat(text) || 0 })}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        multiline
        value={servico.descricao}
        onChangeText={(text) => setServico({ ...servico, descricao: text })}
      />

      {/* Botão salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
        <Text style={styles.saveText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 10 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
