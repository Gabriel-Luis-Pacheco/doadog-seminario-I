import React, { useState } from "react";
import { ScrollView } from "react-native";
import Botao from "../componentes/Botao";
import Campo from "../componentes/Campo";
import Entrar from "./Entrar";
import { api } from "../api";
import { aviso } from "../aviso";
import { useUsuario } from "../usuario";

export default function TelaNovoPedido({ navigation }) {
  const { usuario } = useUsuario();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [meta, setMeta] = useState("");
  const [pix, setPix] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!usuario) {
    return <Entrar mensagem="Entre na sua conta para criar um pedido de ajuda." />;
  }

  async function criar() {
    setEnviando(true);
    try {
      await api.criarPedido({ titulo, descricao, meta, pix });
      aviso("Pronto!", "Seu pedido foi criado.");
      navigation.goBack();
    } catch (erro) {
      aviso("Ops", erro.message);
    }
    setEnviando(false);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Campo nome="Título" value={titulo} onChangeText={setTitulo} />
      <Campo
        nome="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Campo
        nome="Meta em reais (opcional)"
        value={meta}
        onChangeText={setMeta}
        keyboardType="numeric"
      />
      <Campo
        nome="Chave Pix (opcional)"
        value={pix}
        onChangeText={setPix}
        autoCapitalize="none"
      />
      <Botao texto="Criar pedido" aoApertar={criar} desativado={enviando} />
    </ScrollView>
  );
}
