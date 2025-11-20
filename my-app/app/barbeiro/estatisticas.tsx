import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useRouter } from "expo-router";
import * as Print from "expo-print";

export default function EstatisticasScreen() {
  const router = useRouter();
  const [dados, setDados] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [periodo, setPeriodo] = useState<"semanal" | "mensal" | "anual">(
    "semanal"
  );
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
      setMediaAvaliacao(
        qtdAvaliacoes > 0 ? somaAvaliacoes / qtdAvaliacoes : 0
      );
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
 const gerarPDF = async () => {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Relatório de Estatísticas</h1>
          <h3>Período: ${periodo.toUpperCase()}</h3>
          
          <h2>Indicadores</h2>
          <p><strong>Total de Agendamentos:</strong> ${totalAgendamentos}</p>
          <p><strong>Receita Total:</strong> R$ ${receitaTotal.toFixed(2)}</p>
          <p><strong>Média de Avaliação:</strong> ${mediaAvaliacao.toFixed(
            1
          )}</p>

          <h2>Dados do Gráfico</h2>
          <table border="1" cellpadding="6" style="border-collapse: collapse;">
            <tr>
              <th>Label</th>
              <th>Valor</th>
            </tr>
            ${labels
              .map(
                (label, index) => `
              <tr>
                <td>${label}</td>
                <td>${dados[index]}</td>
              </tr>
            `
              )
              .join("")}
          </table>

          <p style="margin-top: 30px; font-size: 12px;">
            Relatório gerado automaticamente pelo app nw.salon
          </p>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#333" />
          <Text style={styles.title}>Estatísticas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
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
      <View style={styles.indicatorsContainer}>
        <View style={[styles.card, { backgroundColor: "#00367c" }]}>
          <Text style={styles.cardLabel}>Concluídos</Text>
          <Text style={styles.cardValue}>{totalAgendamentos}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#005a26ff" }]}>
          <Text style={styles.cardLabel}>Receita</Text>
          <Text style={styles.cardValue}>{receitaTotal.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#f39c12" }]}>
          <Text style={styles.cardLabel}>Avaliação</Text>
          <Text style={styles.cardValue}>{mediaAvaliacao.toFixed(1)}</Text>
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
          barPercentage: 0.7, // 🔹 aumenta a largura das barras
          propsForLabels: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
         style={styles.chart}
      />

      {/* BOTÃO EXPORTAR PDF */}
      <TouchableOpacity style={styles.pdfButton} onPress={gerarPDF}>
        <Text style={styles.pdfButtonText}>Exportar como PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
  },
  cardLabel: {
    color: "#fff",
    fontSize: 14,
  },
  cardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  chart: {
    marginTop: 40,
    alignSelf: "center",
    borderRadius: 16,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: "#f8f8f8",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  pdfButton: {
    marginTop: 30,
    backgroundColor: "#0A3D91",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});