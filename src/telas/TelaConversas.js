import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Entrar from "./Entrar";
import { api } from "../api";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

// Lista das conversas da pessoa
export default function TelaConversas({ navigation }) {
  const { usuario } = useUsuario();
  const [conversas, setConversas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      api.conversas().then(setConversas).catch(() => {});
    }, [usuario])
  );

  if (!usuario) return <Entrar />;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={conversas}
      keyExtractor={(c) => c.cao_id + "-" + c.outro_id}
      renderItem={({ item }) => (
        <Pressable
          style={estilos.conversa}
          onPress={() =>
            navigation.navigate("Chat", {
              caoId: item.cao_id,
              outroId: item.outro_id,
              outroNome: item.outro_nome,
            })
          }
        >
          <Text style={estilos.nome}>
            {item.outro_nome} · sobre {item.cao}
          </Text>
          <Text style={estilos.ultima}>{item.ultima}</Text>
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={estilos.vazio}>
          Nenhuma conversa ainda. Abra um cão e toque em "Conversar".
        </Text>
      }
    />
  );
}

const estilos = StyleSheet.create({
  conversa: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  nome: {
    fontWeight: "bold",
    color: cores.texto,
  },
  ultima: {
    color: cores.textoSuave,
    marginTop: 4,
  },
  vazio: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 30,
  },
});
