import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export default function SuperiorScreen() {

  // Esses ips foram fixados no ESP
  const [lights, setLights] = useState([
    { currentState: false, name: "Sanca", url: "http://192.168.18.104:81/led4_" },
    { currentState: false, name: "Closet", url: "http://192.168.18.104:81/led3_" },
    { currentState: false, name: "Banheiro Suite", url: "http://192.168.18.105:81/led3_" },
    { currentState: false, name: "Nicho", url: "http://192.168.18.105:81/led4_" },
    { currentState: false, name: "Circulação", url: "http://192.168.18.105:81/led2_" },
    { currentState: false, name: "Suíte", url: "http://192.168.18.104:81/led1_" },
    { currentState: false, name: "Varanda", url: "http://192.168.18.104:81/led2_" },
    { currentState: false, name: "Quarto Visita 1", url: "http://192.168.18.103:81/led1_" },
    { currentState: false, name: "Banheiro Visita 1", url: "http://192.168.18.103:81/led2_" },
    { currentState: false, name: "Quarto Visita 2", url: "http://192.168.18.103:81/led3_" },
    { currentState: false, name: "Banheiro Visita 2", url: "http://192.168.18.103:81/led4_" }
  ]);

  const load = async () => {
    setLoading(true);
    let data1 = {
      LED13: false,
      LED14: false,
      LED15: false,
      LED16: false
    };
    let data2 = {
      LED20: false,
      LED19: false,
      LED17: false,
      LED18: false
    };
    let data3 = {
      LED23: false,
      LED24: false,
      LED22: false
    };
    try {
      const res1 = await fetch('http://192.168.18.103:81/status');
      data1 = await res1.json();
    } catch (error) {
      Alert.alert("Erro ao carregar placa 5", String(error));
    }

    try {
      const res2 = await fetch('http://192.168.18.104:81/status');
      data2 = await res2.json();
    } catch (error) {
      Alert.alert("Erro ao carregar placa 6", String(error));
    }

    try {
      const res3 = await fetch('http://192.168.18.105:81/status');
      data3 = await res3.json();
    } catch (error) {
      Alert.alert("Erro ao carregar placa 7", String(error));
    }
    setLoading(false);

    setLights([
      { currentState: data2.LED20, name: "Sanca", url: "http://192.168.18.104:81/led4_" },
      { currentState: data2.LED19, name: "Closet", url: "http://192.168.18.104:81/led3_" },
      { currentState: data3.LED23, name: "Banheiro Suite", url: "http://192.168.18.105:81/led3_" },
      { currentState: data3.LED24, name: "Nicho", url: "http://192.168.18.105:81/led4_" },
      { currentState: data3.LED22, name: "Circulação", url: "http://192.168.18.105:81/led2_" },
      { currentState: data2.LED17, name: "Suíte", url: "http://192.168.18.104:81/led1_" },
      { currentState: data2.LED18, name: "Varanda", url: "http://192.168.18.104:81/led2_" },
      { currentState: data1.LED13, name: "Quarto Visita 1", url: "http://192.168.18.103:81/led1_" },
      { currentState: data1.LED14, name: "Banheiro Visita 1", url: "http://192.168.18.103:81/led2_" },
      { currentState: data1.LED15, name: "Quarto Visita 2", url: "http://192.168.18.103:81/led3_" },
      { currentState: data1.LED16, name: "Banheiro Visita 2", url: "http://192.168.18.103:81/led4_" }
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
        Área Superior
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
