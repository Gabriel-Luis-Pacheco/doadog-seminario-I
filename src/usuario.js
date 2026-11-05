import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { guardarToken } from "./api";

// Guarda quem está logado e lembra do login quando o app é aberto de novo
const UsuarioContext = createContext();
const CHAVE = "doadog-login";

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((texto) => {
        if (texto) {
          const salvo = JSON.parse(texto);
          guardarToken(salvo.token);
          setToken(salvo.token);
          setUsuario(salvo.usuario);
        }
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  // resposta vem do servidor: { token, usuario }
  function entrar(resposta) {
    guardarToken(resposta.token);
    setToken(resposta.token);
    setUsuario(resposta.usuario);
    AsyncStorage.setItem(CHAVE, JSON.stringify(resposta));
  }

  function atualizarUsuario(novoUsuario) {
    setUsuario(novoUsuario);
    AsyncStorage.setItem(CHAVE, JSON.stringify({ token, usuario: novoUsuario }));
  }

  function sair() {
    guardarToken("");
    setToken("");
    setUsuario(null);
    AsyncStorage.removeItem(CHAVE);
  }

  return (
    <UsuarioContext.Provider
      value={{ usuario, carregando, entrar, sair, atualizarUsuario }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  return useContext(UsuarioContext);
}
