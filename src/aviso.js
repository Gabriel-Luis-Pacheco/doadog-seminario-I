import { Alert, Platform } from "react-native";

// O Alert do React Native não aparece no navegador, por isso este jeito
export function aviso(titulo, mensagem) {
  if (Platform.OS === "web") {
    window.alert(titulo + "\n\n" + (mensagem || ""));
  } else {
    Alert.alert(titulo, mensagem);
  }
}
