import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";
import { Link } from "expo-router";

export default function RegisterScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require("../../assets/images/logo-azul.png")}
          style={styles.logo}
        />

        <Text style={styles.subtitle}>Cadastro</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirmar Senha"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* 🔗 Link de volta para Login */}
        <Link href="/(auth)/login" style={styles.link}>
          Já tem conta? Faça login
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
    marginBottom: 70,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f2f2f2",
    marginBottom: 30,
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
