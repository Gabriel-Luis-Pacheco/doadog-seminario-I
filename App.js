import React from "react";
import { ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioProvider, useUsuario } from "./src/usuario";
import { cores } from "./src/cores";

import TelaInicio from "./src/telas/TelaInicio";
import TelaDetalhe from "./src/telas/TelaDetalhe";
import TelaDoacoes from "./src/telas/TelaDoacoes";
import TelaNovoPedido from "./src/telas/TelaNovoPedido";
import TelaAjudar from "./src/telas/TelaAjudar";
import TelaCadastrarCao from "./src/telas/TelaCadastrarCao";
import TelaPerfil from "./src/telas/TelaPerfil";
import TelaConversas from "./src/telas/TelaConversas";
import TelaChat from "./src/telas/TelaChat";

const Abas = createBottomTabNavigator();
const Pilha = createNativeStackNavigator();

// Cada aba de "Adoção" e "Doações" tem mais de uma tela, por isso usam pilha
function PilhaAdocao() {
  return (
    <Pilha.Navigator>
      <Pilha.Screen name="Inicio" component={TelaInicio} options={{ title: "DoaDog" }} />
      <Pilha.Screen name="Detalhe" component={TelaDetalhe} options={{ title: "Detalhes do cão" }} />
    </Pilha.Navigator>
  );
}

function PilhaDoacoes() {
  return (
    <Pilha.Navigator>
      <Pilha.Screen name="Pedidos" component={TelaDoacoes} options={{ title: "Doações" }} />
      <Pilha.Screen name="NovoPedido" component={TelaNovoPedido} options={{ title: "Novo pedido" }} />
      <Pilha.Screen name="Ajudar" component={TelaAjudar} options={{ title: "Quero ajudar" }} />
    </Pilha.Navigator>
  );
}

function PilhaPerfil() {
  return (
    <Pilha.Navigator>
      <Pilha.Screen name="MeuPerfil" component={TelaPerfil} options={{ title: "Perfil" }} />
      <Pilha.Screen name="Conversas" component={TelaConversas} options={{ title: "Conversas" }} />
      <Pilha.Screen
        name="Chat"
        component={TelaChat}
        options={({ route }) => ({ title: route.params.outroNome || "Conversa" })}
      />
    </Pilha.Navigator>
  );
}

const icones = {
  Adoção: "paw",
  Doações: "heart",
  Cadastrar: "add-circle",
  Perfil: "person",
};

function Rotas() {
  const { carregando } = useUsuario();

  if (carregando) {
    return <ActivityIndicator style={{ flex: 1 }} color={cores.verde} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Abas.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: cores.verde,
          tabBarInactiveTintColor: cores.textoSuave,
          tabBarStyle: { backgroundColor: cores.branco },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icones[route.name]} size={size} color={color} />
          ),
        })}
      >
        <Abas.Screen name="Adoção" component={PilhaAdocao} options={{ headerShown: false }} />
        <Abas.Screen name="Doações" component={PilhaDoacoes} options={{ headerShown: false }} />
        <Abas.Screen name="Cadastrar" component={TelaCadastrarCao} />
        <Abas.Screen name="Perfil" component={PilhaPerfil} options={{ headerShown: false }} />
      </Abas.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UsuarioProvider>
      <Rotas />
    </UsuarioProvider>
  );
}
