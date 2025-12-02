import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
export default function HomeScreen() {

  // Esses ips foram fixados no ESP
  const [lights, setLights] = useState([
    { currentState: false, name: "Copa", url: "http://192.168.18.102:81/led4_" },
    { currentState: false, name: "Cozinha", url: "http://192.168.18.102:81/led3_" },
    { currentState: false, name: "Cristaleira", url: "http://192.168.18.101:81/led4_" },
    { currentState: false, name: "Entrada", url: "http://192.168.18.102:81/led2_" },
    { currentState: false, name: "Escritório", url: "http://192.168.18.101:81/led1_" },
    { currentState: false, name: "Lavabo", url: "http://192.168.18.101:81/led2_" },
    { currentState: false, name: "Mesa", url: "http://192.168.18.101:81/led6_" },
    { currentState: false, name: "Sala", url: "http://192.168.18.102:81/led1_" },
  ]);

  const load = async () => {
    setLoading(true);
    let data1 = {
      LED4: false,
      LED1: false,
      LED2: false,
      LED6: false
    };
    let data2 = {
      LED12: false,
      LED11: false,
      LED10: false,
      LED9: false
    };

    try {
      const res1 = await fetch('http://192.168.18.101:81/status');
      data1 = await res1.json();
    } catch (error) {
      Alert.alert("Erro ao carregar placa 1", String(error));
    }

    try {
      const res2 = await fetch('http://192.168.18.102:81/status');
      data2 = await res2.json();
    } catch (error) {
      Alert.alert("Erro ao carregar placa 2", String(error));
    }

    setLoading(false);

    setLights([
      { currentState: data2.LED12, name: "Copa", url: "http://192.168.18.102:81/led4_" },
      { currentState: data2.LED11, name: "Cozinha", url: "http://192.168.18.102:81/led3_" },
      { currentState: data1.LED4, name: "Cristaleira", url: "http://192.168.18.101:81/led4_" },
      { currentState: data2.LED10, name: "Entrada", url: "http://192.168.18.102:81/led2_" },
      { currentState: data1.LED1, name: "Escritório", url: "http://192.168.18.101:81/led1_" },
      { currentState: data1.LED2, name: "Lavabo", url: "http://192.168.18.101:81/led2_" },
      { currentState: data1.LED6, name: "Mesa", url: "http://192.168.18.101:81/led6_" },
      { currentState: data2.LED9, name: "Sala", url: "http://192.168.18.102:81/led1_" },
    ]);

  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const [loading, setLoading] = useState(false);

  const toggle = async (index: number) => {
    setLoading(true);
    const currentState = lights[index].currentState;
    const nextState = !currentState;

    setLights((prev) => {
      const updated = [...prev];
      updated[index].currentState = nextState;
      return updated;
    });

    let url = lights[index].url + (nextState ? 'on' : 'off');
    try {
      const req = await fetch(url);
    } catch (error) {
      Alert.alert("Erro", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <ThemedText type="title" style={styles.title}>
        Área Inferior
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

      {loading && (
        <ThemedView style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </ThemedView>
      )}
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

  loaderOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
