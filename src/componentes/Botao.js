import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { cores } from "../cores";

export default function Botao({ texto, aoApertar, secundario, desativado }) {
  return (
    <Pressable
      onPress={aoApertar}
      disabled={desativado}
      style={[
        estilos.botao,
        secundario && estilos.secundario,
        desativado && { opacity: 0.5 },
      ]}
    >
      <Text style={[estilos.texto, secundario && { color: cores.verde }]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: cores.verde,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  secundario: {
    backgroundColor: cores.verdeClaro,
  },
  texto: {
    color: cores.creme,
    fontSize: 16,
    fontWeight: "bold",
  },
});
