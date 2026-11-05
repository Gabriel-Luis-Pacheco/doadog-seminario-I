import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Botao from "../componentes/Botao";
import { api, urlDaFoto } from "../api";
import { aviso } from "../aviso";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

export default function TelaDetalhe({ route, navigation }) {
  const { usuario } = useUsuario();
  const [cao, setCao] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api
      .buscarCao(route.params.id)
      .then(setCao)
      .catch((e) => setErro(e.message));
  }, []);

  async function tenhoInteresse() {
    if (!usuario) {
      aviso("Entre na sua conta", "Você precisa entrar para demonstrar interesse.");
      navigation.navigate("Perfil");
      return;
    }
    try {
      await api.tenhoInteresse(cao.id);
      aviso(
        "Interesse registrado!",
        "Agora é só falar com " + cao.contato + " para conhecer o " + cao.nome + "."
      );
    } catch (e) {
      aviso("Ops", e.message);
    }
  }

  function conversar() {
    if (!usuario) {
      aviso("Entre na sua conta", "Você precisa entrar para conversar.");
      navigation.navigate("Perfil");
      return;
    }
    // abre o chat que fica dentro da aba Perfil
    navigation.navigate("Perfil", {
      screen: "Chat",
      params: { caoId: cao.id, outroId: cao.usuario_id, outroNome: cao.contato },
    });
  }

  if (erro) return <Text style={estilos.erro}>{erro}</Text>;
  if (!cao) return <Text style={estilos.carregando}>Carregando...</Text>;

  const foto = urlDaFoto(cao.foto);

  return (
    <ScrollView>
      {foto ? <Image source={{ uri: foto }} style={estilos.foto} /> : null}
      <View style={estilos.conteudo}>
        <Text style={estilos.nome}>{cao.nome}</Text>
        <Text style={estilos.info}>
          {cao.porte} · {cao.sexo}
          {cao.idade ? " · " + cao.idade : ""}
        </Text>
        <Text style={estilos.info}>
          {cao.cidade}
          {cao.uf ? " - " + cao.uf : ""}
        </Text>
        <Text style={estilos.descricao}>{cao.descricao}</Text>
        <Text style={estilos.info}>Contato: {cao.contato}</Text>
        <Botao texto="Tenho interesse" aoApertar={tenhoInteresse} />
        {cao.usuario_id && (!usuario || cao.usuario_id !== usuario.id) ? (
          <Botao secundario texto="Conversar" aoApertar={conversar} />
        ) : null}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  foto: {
    width: "100%",
    height: 280,
  },
  conteudo: {
    padding: 16,
  },
  nome: {
    fontSize: 28,
    fontWeight: "bold",
    color: cores.texto,
  },
  info: {
    color: cores.textoSuave,
    marginTop: 4,
  },
  descricao: {
    color: cores.texto,
    fontSize: 16,
    marginVertical: 14,
  },
  erro: {
    color: cores.erro,
    padding: 16,
  },
  carregando: {
    padding: 16,
    color: cores.textoSuave,
  },
});
