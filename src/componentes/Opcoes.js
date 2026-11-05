import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "../cores";

// Linha de botões para escolher uma opção (ex: porte do cão)
export default function Opcoes({ nome, opcoes, valor, aoEscolher }) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={estilos.nome}>{nome}</Text>
      <View style={estilos.linha}>
        {opcoes.map((opcao) => (
          <Pressable
            key={opcao}
            onPress={() => aoEscolher(opcao)}
            style={[estilos.opcao, valor === opcao && estilos.escolhida]}
          >
            <Text style={valor === opcao ? estilos.textoEscolhido : estilos.texto}>
              {opcao}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  nome: {
    color: cores.texto,
    fontWeight: "bold",
    marginBottom: 4,
  },
  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  opcao: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  escolhida: {
    backgroundColor: cores.verde,
    borderColor: cores.verde,
  },
  texto: {
    color: cores.texto,
  },
  textoEscolhido: {
    color: cores.creme,
  },
});
