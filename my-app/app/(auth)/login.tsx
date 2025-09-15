import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')} // caminho relativo da imagem
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require('../../assets/images/logo-azul.png')} // caminho relativo da imagem
          style={styles.logo}
        ></Image>
        <Text style={styles.subtitle}>LOGIN</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          Não possui uma conta? <Text style={{ fontWeight: "bold" }}>Faça o seu cadastro</Text>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    height: 200,
    width: 200,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 70,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f2f2f2",
    marginBottom: 30,
  },
  namelogo: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 80,
    marginTop: -80,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b1b1bff",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: "#f2f2f2",
    height: 50,
  },
  button: {
    backgroundColor: "#d5a759",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  link: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
});
