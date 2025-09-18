import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseConfig";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"admin" | "cliente">("cliente"); // padrão cliente
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // cria usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // salva no Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.push("/login"); // volta para login
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

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
      <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
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
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
    </View>

    <View style={styles.inputContainer}>
      <Text>Tipo de usuário</Text>
      <TouchableOpacity onPress={() => setRole("cliente")}>
        <Text>Cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setRole("admin")}>
        <Text>Barbeiro</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleRegister}>
      <Text style={styles.buttonText}>Cadastrar</Text>
    </TouchableOpacity>

    <Link href="/(auth)/login" style={styles.link}>
      Já possui uma conta? <Text style={{ fontWeight: "bold" }}>Faça login</Text>
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