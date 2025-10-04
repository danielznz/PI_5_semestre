import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export default function EstatisticasScreen() {
  const [dados, setDados] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]); // Seg-Dom
  const [periodo, setPeriodo] = useState<"semanal" | "mensal" | "anual">("semanal");

  useEffect(() => {
    buscarAgendamentos();
  }, [periodo]);

  const buscarAgendamentos = async () => {
    try {
      const agendamentosRef = collection(db, "agendamentos");
      const snapshot = await getDocs(agendamentosRef);

      const contagem = [0, 0, 0, 0, 0, 0, 0]; // seg-dom

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.dataHora) {
          const date = data.dataHora.toDate(); // timestamp → JS Date

          if (periodo === "semanal") {
            const diaSemana = date.getDay(); // 0 = dom, 1 = seg ...
            const index = diaSemana === 0 ? 6 : diaSemana - 1; // ajusta pra seg=0
            contagem[index] += 1;
          }

          if (periodo === "mensal") {
            // Exemplo simples: agrupar por semana do mês
            const semanaDoMes = Math.ceil(date.getDate() / 7);
            if (semanaDoMes <= 7) {
              contagem[semanaDoMes - 1] += 1;
            }
          }

          if (periodo === "anual") {
            // agrupar por mês
            const mes = date.getMonth(); // 0 a 11
            if (mes <= 6) {
              contagem[mes] += 1;
            }
          }
        }
      });

      setDados(contagem);
    } catch (e) {
      console.error("Erro ao buscar agendamentos:", e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#fff" }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Estatísticas
      </Text>

      {/* Botões de filtro */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => setPeriodo("semanal")}>
          <Text style={{ fontWeight: periodo === "semanal" ? "bold" : "normal" }}>
            Semanal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPeriodo("mensal")}>
          <Text style={{ fontWeight: periodo === "mensal" ? "bold" : "normal" }}>
            Mensal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPeriodo("anual")}>
          <Text style={{ fontWeight: periodo === "anual" ? "bold" : "normal" }}>
            Anual
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico */}
      <BarChart
  data={{
    labels:
      periodo === "semanal"
        ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
        : periodo === "mensal"
        ? ["Sem1", "Sem2", "Sem3", "Sem4"]
        : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    datasets: [{ data: dados }],
  }}
  width={Dimensions.get("window").width - 40}
  height={220}
  yAxisLabel=""       // rótulo antes do número
  yAxisSuffix=""      // sufixo obrigatório (coloca vazio se não quiser nada)
  chartConfig={{
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(200, 150, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
  style={{
    marginVertical: 8,
    borderRadius: 16,
  }}
/>

    </ScrollView>
  );
}
