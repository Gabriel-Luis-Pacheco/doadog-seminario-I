import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import CartaoCao from "../componentes/CartaoCao";
import { api } from "../api";
import { cores } from "../cores";

// Lista de cães para adoção, com busca por nome ou cidade
export default function TelaInicio({ navigation }) {
  const [busca, setBusca] = useState("");
  const [caes, setCaes] = useState([]);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      api
        .listarCaes(busca)
        .then((lista) => {
          setCaes(lista);
          setErro("");
        })
        .catch((e) => setErro(e.message));
    }, [busca])
  );

  return (
    <View style={estilos.tela}>
      <TextInput
        style={estilos.busca}
        placeholder="Buscar por nome ou cidade"
        placeholderTextColor={cores.textoSuave}
        value={busca}
        onChangeText={setBusca}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      <FlatList
        data={caes}
        keyExtractor={(cao) => String(cao.id)}
        renderItem={({ item }) => (
          <CartaoCao
            cao={item}
            aoApertar={() => navigation.navigate("Detalhe", { id: item.id })}
          />
        )}
        ListEmptyComponent={
          !erro && <Text style={estilos.vazio}>Nenhum cão encontrado.</Text>
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
  busca: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: cores.texto,
    marginBottom: 12,
  },
  erro: {
    color: cores.erro,
    marginBottom: 8,
  },
  vazio: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 30,
  },
});
