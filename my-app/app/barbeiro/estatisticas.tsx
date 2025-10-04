import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export default function EstatisticasScreen() {
  const [dados, setDados] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [periodo, setPeriodo] = useState<"semanal" | "mensal" | "anual">("semanal");
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);

  useEffect(() => {
    buscarAgendamentos();
  }, [periodo]);

  const buscarAgendamentos = async () => {
    try {
      const ref = collection(db, "agendamentos");
      const snapshot = await getDocs(ref);

      const contagem = [0, 0, 0, 0, 0, 0, 0];
      let total = 0;
      let somaPreco = 0;
      let somaAvaliacoes = 0;
      let qtdAvaliacoes = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status !== "concluido" || !data.data) return;

        const [dia, mes, ano] = data.data.split("/").map(Number);
        const date = new Date(ano, mes - 1, dia);

        total++;
        somaPreco += data.preco || 0;
        if (data.avaliacao) {
          somaAvaliacoes += data.avaliacao;
          qtdAvaliacoes++;
        }

        if (periodo === "semanal") {
          const diaSemana = date.getDay();
          const index = diaSemana === 0 ? 6 : diaSemana - 1;
          contagem[index]++;
        }

        if (periodo === "mensal") {
          const semanaDoMes = Math.ceil(date.getDate() / 7);
          if (semanaDoMes <= 4) contagem[semanaDoMes - 1]++;
        }

        if (periodo === "anual") {
          const mes = date.getMonth();
          if (mes <= 6) contagem[mes]++;
        }
      });

      setDados(contagem);
      setTotalAgendamentos(total);
      setReceitaTotal(somaPreco);
      setMediaAvaliacao(qtdAvaliacoes > 0 ? somaAvaliacoes / qtdAvaliacoes : 0);
    } catch (e) {
      console.error("Erro ao buscar agendamentos:", e);
    }
  };

  const labels =
    periodo === "semanal"
      ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
      : periodo === "mensal"
      ? ["Sem1", "Sem2", "Sem3", "Sem4"]
      : ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
      }}
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

      {/* Indicadores */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#0a3d91",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            width: "30%",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Concluídos</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            {totalAgendamentos}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#27ae60",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            width: "30%",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Receita (R$)</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            {receitaTotal.toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#f39c12",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            width: "30%",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Avaliação</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            {mediaAvaliacao.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Gráfico */}
      <BarChart
        data={{
          labels,
          datasets: [{ data: dados }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(10, 61, 145, ${opacity})`,
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
