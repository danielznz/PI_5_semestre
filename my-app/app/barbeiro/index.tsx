import { View, Text, TouchableOpacity} from "react-native";

export default function BarbeiroDashboard() {
  return (
    <View >
      <Text>Dashboard do Barbeiro</Text>

      <TouchableOpacity>
        <Text>Cadastrar Serviços</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text>Definir Horários</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text>Ver Agendamentos</Text>
      </TouchableOpacity>
    </View>
  );
}

