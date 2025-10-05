import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Agendamento() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [hora, setHora] = useState<string | null>(null);
  const [barbeiro, setBarbeiro] = useState<string | null>(null);
  const [servico, setServico] = useState<any | null>(null);

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<any[]>([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const barbeirosMap: Record<string, { nome: string; foto: any }> = {
    Matheus: { nome: "Matheus", foto: require("../../assets/images/perfil.png") },
    Igor: { nome: "Igor", foto: require("../../assets/images/perfil.png") },
  };

  // Buscar horários disponíveis
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
        const selectedDateBR = date.toLocaleDateString("pt-BR");

        const timeToMinutes = (t?: string) => {
          if (!t) return Infinity;
          const [h, m] = t.split(":").map(Number);
          return h * 60 + m;
        };

    const mapped = snap.docs.map((doc) => {
  const d = doc.data() as {
    barbeiro?: string;
    data?: string;
    hora?: string;
    disponibilidade?: boolean;
  };
    return {
    id: doc.id,
    barbeiro: d.barbeiro ?? "",
    data: d.data ?? "",
    hora: d.hora ?? "",
    disponibilidade: d.disponibilidade ?? true,
  };
});

        const filteredByDate = mapped.filter((h) => h.data === selectedDateBR);
        const ordenados = filteredByDate.sort(
          (a, b) => timeToMinutes(a.hora) - timeToMinutes(b.hora)
        );

        setHorariosDisponiveis(ordenados);
      } catch (err) {
        console.error("Erro ao buscar horários:", err);
        setHorariosDisponiveis([]);
      }
    };

    fetchDisponibilidades();
  }, [barbeiro, date]);

  // Buscar serviços do barbeiro selecionado
  useEffect(() => {
    const fetchServicos = async () => {
      if (!barbeiro) {
        setServicosDisponiveis([]);
        return;
      }

      try {
        const ref = collection(db, "servicos");
        const q = query(ref, where("barbeiro", "==", barbeiro));
        const snap = await getDocs(q);

        const servicos = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServicosDisponiveis(servicos);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      }
    };

    fetchServicos();
  }, [barbeiro]);

  // Agendar
  const handleAgendar = async () => {
    if (!date || !hora || !servico || !barbeiro) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("❌ Usuário não autenticado!");
        return;
      }

      // Salvar o agendamento
      await addDoc(collection(db, "agendamentos"), {
        barbeiro,
        servico: servico.nome,
        preco: servico.preco,
        data: date.toLocaleDateString("pt-BR"),
        hora,
        emailcliente: user.email,
        createdAt: serverTimestamp(),
      });

      // Atualizar disponibilidade do horário
      const horarioSelecionado = horariosDisponiveis.find((h) => h.hora === hora);
      if (horarioSelecionado) {
        await updateDoc(doc(db, "horarios", horarioSelecionado.id), {
          disponibilidade: false,
        });
      }

      alert("✅ Agendamento salvo com sucesso!");
      router.back();
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      alert("❌ Erro ao salvar agendamento.");
    } finally {
      setLoading(false);
    }
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
          minimumDate={new Date()} // 🔒 Bloqueia datas passadas
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
            onPress={() => {
              setBarbeiro(b);
              setHora(null);
              setServico(null);
            }}
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
      {barbeiro && (
        <>
          <Text style={styles.label}>Selecione o serviço:</Text>
          <View style={styles.optionsContainer}>
            {servicosDisponiveis.length === 0 ? (
              <Text style={{ color: "#fff" }}>Nenhum serviço disponível para {barbeiro}</Text>
            ) : (
              servicosDisponiveis.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.option, servico?.id === s.id && styles.optionSelected]}
                  onPress={() => setServico(s)}
                >
                  <Text style={styles.optionText}>
                    {s.nome} - R$ {s.preco}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </>
      )}

      {/* Resumo */}
      {servico && hora && (
        <View style={{ marginTop: 25 }}>
          <Text style={{ color: "#f2f2f2", fontSize: 16 }}>
            💈 {servico.nome} — R$ {servico.preco}
          </Text>
          <Text style={{ color: "#f2f2f2" }}>
            📅 {date.toLocaleDateString("pt-BR")} às {hora} com {barbeiro}
          </Text>
        </View>
      )}

      {/* Botão Agendar */}
      <TouchableOpacity style={styles.button} onPress={handleAgendar} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#1b1b1bff" />
        ) : (
          <Text style={styles.buttonText}>Agendar</Text>
        )}
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
    width: 150,
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
