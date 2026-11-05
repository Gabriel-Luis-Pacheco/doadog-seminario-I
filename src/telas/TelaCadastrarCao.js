import React, { useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Botao from "../componentes/Botao";
import Campo from "../componentes/Campo";
import Opcoes from "../componentes/Opcoes";
import Entrar from "./Entrar";
import { api } from "../api";
import { aviso } from "../aviso";
import { useUsuario } from "../usuario";

export default function TelaCadastrarCao({ navigation }) {
  const { usuario } = useUsuario();
  const [foto, setFoto] = useState(""); // foto em base64
  const [fotoPrevia, setFotoPrevia] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [porte, setPorte] = useState("Médio");
  const [sexo, setSexo] = useState("Macho");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!usuario) {
    return <Entrar mensagem="Entre na sua conta para cadastrar um cão." />;
  }

  async function escolherFoto() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.3, // qualidade baixa para a foto ficar leve
      base64: true,
    });
    if (!resultado.canceled) {
      const imagem = resultado.assets[0];
      setFotoPrevia(imagem.uri);
      setFoto("data:image/jpeg;base64," + imagem.base64);
    }
  }

  async function cadastrar() {
    setEnviando(true);
    try {
      await api.cadastrarCao({
        nome, idade, porte, sexo, cidade, uf, descricao, contato, foto,
      });
      aviso("Pronto!", nome + " foi cadastrado.");
      setFoto("");
      setFotoPrevia("");
      setNome("");
      setIdade("");
      setCidade("");
      setUf("");
      setDescricao("");
      setContato("");
      navigation.navigate("Adoção");
    } catch (erro) {
      aviso("Ops", erro.message);
    }
    setEnviando(false);
  }

  return (
    <ScrollView contentContainerStyle={estilos.tela}>
      {fotoPrevia ? (
        <Image source={{ uri: fotoPrevia }} style={estilos.previa} />
      ) : null}
      <Botao
        secundario
        texto={fotoPrevia ? "Trocar foto" : "Escolher foto"}
        aoApertar={escolherFoto}
      />

      <Campo nome="Nome do cão" value={nome} onChangeText={setNome} />
      <Campo nome="Idade (ex: 2 anos)" value={idade} onChangeText={setIdade} />
      <Opcoes
        nome="Porte"
        opcoes={["Pequeno", "Médio", "Grande"]}
        valor={porte}
        aoEscolher={setPorte}
      />
      <Opcoes
        nome="Sexo"
        opcoes={["Macho", "Fêmea"]}
        valor={sexo}
        aoEscolher={setSexo}
      />
      <Campo nome="Cidade" value={cidade} onChangeText={setCidade} />
      <Campo nome="UF" value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters" />
      <Campo
        nome="Conte sobre o cão"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Campo
        nome="Contato (nome ou telefone)"
        value={contato}
        onChangeText={setContato}
      />

      <Botao texto="Cadastrar cão" aoApertar={cadastrar} desativado={enviando} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    padding: 16,
  },
  previa: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
});
