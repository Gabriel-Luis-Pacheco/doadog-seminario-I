import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { cores } from "../cores";

// Campo de texto com o nome em cima. Aceita as mesmas props do TextInput.
export default function Campo({ nome, ...resto }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.nome}>{nome}</Text>
      <TextInput
        style={[estilos.campo, resto.multiline && { height: 100 }]}
        placeholderTextColor={cores.textoSuave}
        {...resto}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    marginTop: 12,
  },
  nome: {
    color: cores.texto,
    fontWeight: "bold",
    marginBottom: 4,
  },
  campo: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: cores.texto,
    textAlignVertical: "top",
  },
});
