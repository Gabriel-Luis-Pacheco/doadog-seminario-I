import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Botao from "../componentes/Botao";
import Campo from "../componentes/Campo";
import Entrar from "./Entrar";
import { api } from "../api";
import { aviso } from "../aviso";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

export default function TelaPerfil({ navigation }) {
  const { usuario, sair, atualizarUsuario } = useUsuario();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [meusCaes, setMeusCaes] = useState([]);
  const [minhasAjudas, setMinhasAjudas] = useState([]);

  // Quando a pessoa entra na conta, preenche os campos com os dados dela
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setTelefone(usuario.telefone || "");
      setCidade(usuario.cidade || "");
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      api.meusCaes().then(setMeusCaes).catch(() => {});
      api.minhasAjudas().then(setMinhasAjudas).catch(() => {});
    }, [usuario])
  );

  if (!usuario) return <Entrar />;

  async function salvar() {
    try {
      const novo = await api.salvarPerfil({ nome, telefone, cidade });
      atualizarUsuario(novo);
      aviso("Pronto!", "Seus dados foram salvos.");
    } catch (erro) {
      aviso("Ops", erro.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.tela}>
      <Text style={estilos.email}>{usuario.email}</Text>
      <Campo nome="Nome" value={nome} onChangeText={setNome} />
      <Campo
        nome="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <Campo nome="Cidade" value={cidade} onChangeText={setCidade} />
      <Botao texto="Salvar" aoApertar={salvar} />
      <Botao
        secundario
        texto="Minhas conversas"
        aoApertar={() => navigation.navigate("Conversas")}
      />

      <Text style={estilos.titulo}>Meus cães</Text>
      {meusCaes.length === 0 && <Text style={estilos.texto}>Nenhum cão cadastrado.</Text>}
      {meusCaes.map((cao) => (
        <Text key={cao.id} style={estilos.texto}>
          • {cao.nome} ({cao.cidade})
        </Text>
      ))}

      <Text style={estilos.titulo}>Minhas ajudas</Text>
      {minhasAjudas.length === 0 && <Text style={estilos.texto}>Nenhuma ajuda ainda.</Text>}
      {minhasAjudas.map((ajuda) => (
        <Text key={ajuda.id} style={estilos.texto}>
          • {ajuda.tipo}
          {ajuda.valor > 0 ? " de R$ " + ajuda.valor : ""} para "{ajuda.pedido}"
        </Text>
      ))}

      <Botao secundario texto="Sair da conta" aoApertar={sair} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    padding: 16,
  },
  email: {
    color: cores.textoSuave,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: cores.texto,
    marginTop: 24,
  },
  texto: {
    color: cores.texto,
    marginTop: 6,
  },
});
