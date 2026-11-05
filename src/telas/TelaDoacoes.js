import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Botao from "../componentes/Botao";
import { api } from "../api";
import { cores } from "../cores";

// Lista de pedidos de ajuda
export default function TelaDoacoes({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      api
        .listarPedidos()
        .then((lista) => {
          setPedidos(lista);
          setErro("");
        })
        .catch((e) => setErro(e.message));
    }, [])
  );

  return (
    <View style={estilos.tela}>
      <Botao
        texto="Criar pedido de ajuda"
        aoApertar={() => navigation.navigate("NovoPedido")}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      <FlatList
        style={{ marginTop: 12 }}
        data={pedidos}
        keyExtractor={(pedido) => String(pedido.id)}
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={estilos.titulo}>{item.titulo}</Text>
            <Text style={estilos.texto}>{item.descricao}</Text>
            {item.responsavel ? (
              <Text style={estilos.info}>Por {item.responsavel}</Text>
            ) : null}
            {item.meta > 0 ? (
              <Text style={estilos.info}>Meta: R$ {item.meta}</Text>
            ) : null}
            {item.pix ? <Text style={estilos.info}>Pix: {item.pix}</Text> : null}
            <Text style={estilos.info}>
              {item.pessoas} pessoa(s) querem ajudar
            </Text>
            <Botao
              secundario
              texto="Quero ajudar"
              aoApertar={() => navigation.navigate("Ajudar", { pedido: item })}
            />
          </View>
        )}
        ListEmptyComponent={
          !erro && <Text style={estilos.vazio}>Nenhum pedido ainda.</Text>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 16,
  },
  cartao: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.texto,
  },
  texto: {
    color: cores.texto,
    marginTop: 6,
  },
  info: {
    color: cores.textoSuave,
    marginTop: 4,
  },
  erro: {
    color: cores.erro,
    marginTop: 8,
  },
  vazio: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 30,
  },
});
