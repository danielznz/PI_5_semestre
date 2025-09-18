import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseConfig";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 🔍 busca role no Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);


      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.role === "admin") {
          router.push("/barbeiro");
        } else {
          router.push("/(tabs)");
        }
      } else {
        Alert.alert("Erro", "Usuário não encontrado no Firestore.");
      }
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

        <Text style={styles.subtitle}>LOGIN</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
