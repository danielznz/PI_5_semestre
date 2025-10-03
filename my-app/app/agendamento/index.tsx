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

  // Mapeando barbeiros
  const barbeirosMap: Record<string, { nome: string; foto: any }> = {
    Matheus: { nome: "Matheus", foto: require("../../assets/images/perfil.png") },
    Igor: { nome: "Igor", foto: require("../../assets/images/perfil.png") },
  };

useEffect(() => {
  const fetchDisponibilidades = async () => {
    if (!barbeiro) {
      setHorariosDisponiveis([]);
      return;
    }

    try {
      const ref = collection(db, "horarios");
      const q = query(
        ref,
        where("barbeiro", "==", barbeiro), 
        where("disponibilidade", "==", true)
      );

      const snap = await getDocs(q);

      // data escolhida pelo usuário no formato dd/mm/yyyy
      const selectedDateBR = date.toLocaleDateString("pt-BR"); // "10/10/2025"

      // helper: converte "HH:mm" -> minutos (para ordenar)
      const timeToMinutes = (t?: string) => {
        if (!t) return Infinity;
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const mapped = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          barbeiro: d.barbeiro ?? d.barbeiroNome ?? null,
          data: d.data,   // já vem salvo "10/10/2025"
          hora: d.hora,
          disponibilidade: d.disponibilidade ?? true,
        };
      });

      // 🔥 agora filtra usando dd/mm/yyyy
      const filteredByDate = mapped.filter((h) => h.data === selectedDateBR);

      // ordena por hora
      const ordenados = filteredByDate.sort((a, b) => timeToMinutes(a.hora) - timeToMinutes(b.hora));

      setHorariosDisponiveis(ordenados);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
      setHorariosDisponiveis([]);
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
Dia: ${date.toLocaleDateString("pt-BR")}
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
      <TouchableOpacity style={styles.selectButton} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toLocaleDateString("pt-BR")}</Text>
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
              style={[styles.option, hora === h.hora && styles.optionSelected]}
              onPress={() => setHora(h.hora)}
            >
              <Text style={styles.optionText}>{h.hora}</Text>
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
    color: "#f2f2f2",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    color: "#f2f2f2",
    marginTop: 30,
    marginBottom: 8,
    fontSize: 16,
  },
  optionText: {
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  selectButton: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
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
    backgroundColor: "#d5a759",
  },
  barbeiroImg: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#d5a759",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#1b1b1bff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
