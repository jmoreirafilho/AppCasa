import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

export default function HomeScreen() {

  // Esses ips foram fixados no ESP
  const [lights, setLights] = useState([
    { currentState: false, name: "Banheiro Deck", url: "http://192.168.18.101:81/led3_" },
    { currentState: false, name: "Deck", url: "http://192.168.18.101:81/led7_" },
    { currentState: false, name: "Gazebo", url: "http://192.168.18.101:81/led5_" },
    { currentState: false, name: "Quintal", url: "http://192.168.18.101:81/led8_" }
  ]);

  const toggle = async (index: number) => {
    setLights((prev) => {
      const updated = [...prev];
      updated[index].currentState = !updated[index].currentState;
      return updated;
    });

    let url = lights[index].url + (lights[index].currentState ? 'on' : 'off');
    try {
      const req = await fetch(url);
      Alert.alert("Sucesso", await req.text());
    } catch (error) {
      Alert.alert("Erro", String(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <ThemedText type="title" style={styles.title}>
        Área Externa
      </ThemedText>

      {lights.map((light, index) => (
        <ThemedView key={light.name} style={styles.card}>
          <ThemedText style={styles.lightName}>{light.name}</ThemedText>

          <TouchableOpacity onPress={() => toggle(index)}>
            <Ionicons name={light.currentState ? "bulb" : "bulb-outline"}
              size={32}
              color={light.currentState ? "#FFD700" : "#888"}
            ></Ionicons>
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  title: {
    fontSize: 32,
    marginBottom: 20
  },

  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // sombra leve estilo iOS/Android
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  lightName: {
    fontSize: 18,
    fontWeight: "600",
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  buttonOn: {
    backgroundColor: "#4CAF50",
  },

  buttonOff: {
    backgroundColor: "#d32f2f",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
