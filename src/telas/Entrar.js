import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Botao from "../componentes/Botao";
import Campo from "../componentes/Campo";
import { api } from "../api";
import { aviso } from "../aviso";
import { cores } from "../cores";
import { useUsuario } from "../usuario";

// Tela de login e de criar conta (a mesma tela troca entre as duas)
export default function Entrar({ mensagem }) {
  const { entrar } = useUsuario();
  const [criandoConta, setCriandoConta] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setEnviando(true);
    try {
      const resposta = criandoConta
        ? await api.cadastrar({ nome, email, senha, telefone, cidade })
        : await api.entrar(email, senha);
      entrar(resposta);
    } catch (erro) {
      aviso("Ops", erro.message);
    }
    setEnviando(false);
  }

  return (
    <ScrollView contentContainerStyle={estilos.tela}>
      <Text style={estilos.titulo}>
        {criandoConta ? "Criar conta" : "Entrar"}
      </Text>
      <Text style={estilos.mensagem}>
        {mensagem || "Entre para cadastrar cães e pedir ajuda."}
      </Text>

      {criandoConta && <Campo nome="Nome" value={nome} onChangeText={setNome} />}
      <Campo
        nome="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Campo
        nome="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {criandoConta && (
        <>
          <Campo
            nome="Telefone (opcional)"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
          <Campo nome="Cidade" value={cidade} onChangeText={setCidade} />
        </>
      )}

      <Botao
        texto={criandoConta ? "Criar conta" : "Entrar"}
        aoApertar={enviar}
        desativado={enviando}
      />
      <Botao
        secundario
        texto={criandoConta ? "Já tenho conta" : "Quero criar uma conta"}
        aoApertar={() => setCriandoConta(!criandoConta)}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: cores.texto,
  },
  mensagem: {
    color: cores.textoSuave,
    marginTop: 4,
  },
});
