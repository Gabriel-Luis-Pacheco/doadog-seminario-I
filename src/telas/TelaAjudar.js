import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import Botao from "../componentes/Botao";
import Campo from "../componentes/Campo";
import Opcoes from "../componentes/Opcoes";
import Entrar from "./Entrar";
import { api } from "../api";
import { aviso } from "../aviso";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

// O app só registra que a pessoa quer ajudar. Ele não faz o pagamento.
export default function TelaAjudar({ route, navigation }) {
  const { usuario } = useUsuario();
  const pedido = route.params.pedido;
  const [tipo, setTipo] = useState("Dinheiro");
  const [valor, setValor] = useState("");
  const [mensagem, setMensagem] = useState("");

  if (!usuario) {
    return <Entrar mensagem="Entre na sua conta para ajudar." />;
  }

  async function enviar() {
    try {
      await api.querAjudar(pedido.id, { tipo, valor, mensagem });
      const orientacao = pedido.pix
        ? "Para doar dinheiro, use a chave Pix: " + pedido.pix + ". O app não faz pagamentos."
        : "Combine a ajuda com " + (pedido.responsavel || "quem criou o pedido") + ".";
      aviso("Obrigado por ajudar!", orientacao);
      navigation.goBack();
    } catch (erro) {
      aviso("Ops", erro.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: cores.texto }}>
        {pedido.titulo}
      </Text>
      <Opcoes
        nome="Como quer ajudar?"
        opcoes={["Dinheiro", "Ração", "Remédio", "Outro"]}
        valor={tipo}
        aoEscolher={setTipo}
      />
      <Campo
        nome="Valor em reais (opcional)"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      <Campo
        nome="Mensagem (opcional)"
        value={mensagem}
        onChangeText={setMensagem}
        multiline
      />
      <Botao texto="Quero ajudar" aoApertar={enviar} />
    </ScrollView>
  );
}
