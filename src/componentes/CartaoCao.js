import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "../cores";
import { urlDaFoto } from "../api";

export default function CartaoCao({ cao, aoApertar }) {
  const foto = urlDaFoto(cao.foto);
  return (
    <Pressable style={estilos.cartao} onPress={aoApertar}>
      {foto ? (
        <Image source={{ uri: foto }} style={estilos.foto} />
      ) : (
        <View style={[estilos.foto, estilos.semFoto]}>
          <Text style={{ color: cores.textoSuave }}>Sem foto</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={estilos.nome}>{cao.nome}</Text>
        <Text style={estilos.info}>
          {cao.porte} · {cao.sexo}
          {cao.idade ? " · " + cao.idade : ""}
        </Text>
        <Text style={estilos.info}>
          {cao.cidade}
          {cao.uf ? " - " + cao.uf : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: "row",
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  foto: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  semFoto: {
    backgroundColor: cores.verdeClaro,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.texto,
  },
  info: {
    color: cores.textoSuave,
    marginTop: 2,
  },
});
