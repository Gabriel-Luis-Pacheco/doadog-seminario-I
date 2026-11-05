import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../api";
import { aviso } from "../aviso";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

// Conversa entre duas pessoas sobre um cão
export default function TelaChat({ route }) {
  const { usuario } = useUsuario();
  const { caoId, outroId } = route.params;
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  function carregar() {
    api
      .mensagens(caoId, outroId)
      .then(setMensagens)
      .catch(() => {});
  }

  // Busca as mensagens de novo a cada 5 segundos
  useEffect(() => {
    carregar();
    const relogio = setInterval(carregar, 5000);
    return () => clearInterval(relogio);
  }, []);

  async function enviar() {
    if (!texto.trim()) return;
    try {
      await api.enviarMensagem({ caoId, paraId: outroId, texto });
      setTexto("");
      carregar();
    } catch (erro) {
      aviso("Ops", erro.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={mensagens}
        keyExtractor={(m) => String(m.id)}
        renderItem={({ item }) => {
          const minha = item.remetente_id === usuario.id;
          return (
            <View style={[estilos.balao, minha ? estilos.minha : estilos.dele]}>
              <Text style={{ color: minha ? cores.creme : cores.texto }}>
                {item.texto}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={estilos.vazio}>Mande a primeira mensagem.</Text>
        }
      />
      <View style={estilos.barra}>
        <TextInput
          style={estilos.campo}
          placeholder="Escreva uma mensagem"
          placeholderTextColor={cores.textoSuave}
          value={texto}
          onChangeText={setTexto}
        />
        <Pressable style={estilos.enviar} onPress={enviar}>
          <Text style={{ color: cores.creme, fontWeight: "bold" }}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  balao: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  minha: {
    backgroundColor: cores.verde,
    alignSelf: "flex-end",
  },
  dele: {
    backgroundColor: cores.verdeClaro,
    alignSelf: "flex-start",
  },
  vazio: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 30,
  },
  barra: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: cores.branco,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  campo: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    paddingHorizontal: 14,
    color: cores.texto,
  },
  enviar: {
    backgroundColor: cores.verde,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginLeft: 8,
  },
});
