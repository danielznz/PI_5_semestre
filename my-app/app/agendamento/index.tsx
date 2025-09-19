import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Agendamento() {
    const router = useRouter();

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [hora, setHora] = useState<string | null>(null);
    const [barbeiro, setBarbeiro] = useState<string | null>(null);
    const [servico, setServico] = useState<string | null>(null);

    const [horariosDisponiveis, setHorariosDisponiveis] = useState<any[]>([]);

    // Mapeando barbeiros com imagem
    const barbeirosMap: Record<string, { id: string; foto: any }> = {
        Matheus: { id: "idDocMatheus", foto: require("../../assets/images/perfil.png") },
        Igor: { id: "idDocIgor", foto: require("../../assets/images/perfil.png") },
        David: { id: "idDocDavid", foto: require("../../assets/images/perfil.png") },
    };

    useEffect(() => {
        const fetchDisponibilidades = async () => {
            if (!barbeiro) return;

            try {
                const barbeiroId = barbeirosMap[barbeiro]?.id;
                if (!barbeiroId) return;

                const ref = collection(db, "users", barbeiroId, "disponibilidades");
                const q = query(ref, where("status", "==", "livre"));
                const snap = await getDocs(q);

                const disponiveis = snap.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        data: doc.data().data.toDate(),
                    }))
                    .filter((d) => d.data.toDateString() === date.toDateString());

                setHorariosDisponiveis(disponiveis);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDisponibilidades();
    }, [barbeiro, date]);

    const handleAgendar = () => {
        if (!date || !hora || !servico || !barbeiro) {
            alert("⚠️ Preencha todos os campos!");
            return;
        }

        alert(`✅ Agendamento criado:
    Dia: ${date.toLocaleDateString()}
    Hora: ${hora}
    Barbeiro: ${barbeiro}
    Serviço: ${servico}`);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Agendamento</Text>
            </View>

            {/* Selecionar Data */}
            <Text style={styles.label}>Selecione o dia:</Text>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            {/* Selecionar Barbeiro */}
            <Text style={styles.label}>Selecione o barbeiro:</Text>
            <View style={styles.optionsContainer}>
                {Object.keys(barbeirosMap).map((b) => (
                    <TouchableOpacity
                        key={b}
                        style={[styles.option, barbeiro === b && styles.optionSelected]}
                        onPress={() => setBarbeiro(b)}
                    >
                        <Image source={barbeirosMap[b].foto} style={styles.barbeiroImg} />
                        <Text style={styles.optionText}>{b}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Selecionar Hora */}
            <Text style={styles.label}>Selecione a hora:</Text>
            <View style={styles.optionsContainer}>
                {horariosDisponiveis.length === 0 ? (
                    <Text style={{ color: "#fff" }}>Nenhum horário disponível</Text>
                ) : (
                    horariosDisponiveis.map((h) => (
                        <TouchableOpacity
                            key={h.id}
                            style={[
                                styles.option,
                                hora === h.data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) && styles.optionSelected,
                            ]}
                            onPress={() =>
                                setHora(
                                    h.data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                )
                            }
                        >
                            <Text>
                                {h.data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>

            {/* Selecionar Serviço */}
            <Text style={styles.label}>Selecione o serviço:</Text>
            <View style={styles.optionsContainer}>
                {["Corte", "Barba", "Corte + Barba"].map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.option, servico === s && styles.optionSelected]}
                        onPress={() => setServico(s)}
                    >
                        <Text style={styles.optionText}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botão Agendar */}
            <TouchableOpacity style={styles.button} onPress={handleAgendar}>
                <Text style={styles.buttonText}>Agendar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1b1b1bff",
        padding: 16
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
        color: "#f2f2f2",
        fontSize: 20,
        fontWeight: "bold"
    },

    label: {
        color: "#f2f2f2",
        marginTop: 30,
        marginBottom: 8,
        fontSize: 16
    },
    optionText: {
        color: "#f2f2f2",
        fontSize: 16,
        fontWeight: "900",
        alignItems: "center",
        textAlign: "center"
    },

    selectButton: {
        backgroundColor: "#f2f2f2",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    },

    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    option: {
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: 110,
    },

    optionSelected: {
        backgroundColor: "#d5a759"
    },

    textSelected: {
        backgroundColor: "#333"
    },

    barbeiroImg: {
        width: 60,
        height: 60,
        borderRadius: 25,
        marginBottom: 6
    },

    button: {
        backgroundColor: "#d5a759",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 40
    },

    buttonText: {
        color: "#1b1b1bff",
        fontSize: 16,
        fontWeight: "bold"
    }
});
