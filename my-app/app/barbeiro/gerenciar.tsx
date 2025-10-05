import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

type Servico = {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    descricao: string;
};

export default function GerenciarServicos() {
    const router = useRouter();
    const [servicos, setServicos] = useState<Servico[]>([]);

    // 🔹 Buscar serviços do Firestore
    const carregarServicos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "servicos"));
            const lista: Servico[] = [];
            querySnapshot.forEach((docSnap) => {
                lista.push({ id: docSnap.id, ...(docSnap.data() as Omit<Servico, "id">) });
            });
            setServicos(lista);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        }
    };

    useEffect(() => {
        carregarServicos();
    }, []);

    // 🔹 Excluir serviço do Firestore
    const excluirServico = async (id: string) => {
        try {
            await deleteDoc(doc(db, "servicos", id));
            setServicos((prev) => prev.filter((s) => s.id !== id));
            Alert.alert("Sucesso", "Serviço excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir serviço:", error);
            Alert.alert("Erro", "Não foi possível excluir o serviço.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Gerenciar Serviços</Text>
            </View>

            {/* Lista de serviços */}
            <ScrollView contentContainerStyle={styles.content}>
                {servicos.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 30, color: "#666" }}>
                        Nenhum serviço cadastrado.
                    </Text>
                ) : (
                    servicos.map((servico) => (
                        <View key={servico.id} style={styles.card}>
                            <Text style={styles.nome}>{servico.nome}</Text>
                            <Text>Categoria: {servico.categoria}</Text>
                            <Text>Preço: R$ {servico.preco.toFixed(2)}</Text>
                            <Text>Descrição: {servico.descricao}</Text>

                            {/* Botões de ação */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() =>
                                        Alert.alert(
                                            "Confirmação",
                                            "Deseja realmente excluir este serviço?",
                                            [
                                                { text: "Cancelar", style: "cancel" },
                                                { text: "Excluir", style: "destructive", onPress: () => excluirServico(servico.id) },
                                            ]
                                        )
                                    }
                                >
                                    <Ionicons name="trash" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    backButton: { marginRight: 10 },
    title: { fontSize: 22, fontWeight: "bold", color: "#000" },
    content: { padding: 20 },
    card: {
        backgroundColor: "#e5eefc",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    nome: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    editButton: {
        backgroundColor: "#005a26ff",
        padding: 10,
        borderRadius: 6,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 6,
    },
});
