// Aqui ficam todas as conversas do aplicativo com o servidor.

// Se for testar no celular, troque localhost pelo IP do computador
// (veja o README). Dá para mudar também com a variável EXPO_PUBLIC_API_URL.
export const URL_API = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3333";

let token = "";

export function guardarToken(novoToken) {
  token = novoToken;
}

async function chamar(caminho, metodo = "GET", corpo) {
  let resposta;
  try {
    resposta = await fetch(URL_API + caminho, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (erro) {
    throw new Error("Não consegui conectar ao servidor. Ele está ligado?");
  }
  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.erro || "Algo deu errado. Tente de novo.");
  }
  return dados;
}

export const api = {
  cadastrar: (dados) => chamar("/cadastro", "POST", dados),
  entrar: (email, senha) => chamar("/login", "POST", { email, senha }),
  salvarPerfil: (dados) => chamar("/perfil", "PUT", dados),

  listarCaes: (busca) => chamar("/caes?busca=" + encodeURIComponent(busca || "")),
  buscarCao: (id) => chamar("/caes/" + id),
  cadastrarCao: (dados) => chamar("/caes", "POST", dados),
  meusCaes: () => chamar("/meus-caes"),
  tenhoInteresse: (id) => chamar("/caes/" + id + "/interesse", "POST"),

  conversas: () => chamar("/conversas"),
  mensagens: (caoId, comId) => chamar("/mensagens?cao=" + caoId + "&com=" + comId),
  enviarMensagem: (dados) => chamar("/mensagens", "POST", dados),

  listarPedidos: () => chamar("/pedidos"),
  criarPedido: (dados) => chamar("/pedidos", "POST", dados),
  querAjudar: (id, dados) => chamar("/pedidos/" + id + "/ajuda", "POST", dados),
  minhasAjudas: () => chamar("/minhas-ajudas"),
};

// A foto pode ser um arquivo do servidor ou uma imagem enviada pelo celular
export function urlDaFoto(foto) {
  if (!foto) return null;
  if (foto.startsWith("data:") || foto.startsWith("http")) return foto;
  return URL_API + "/fotos/" + foto;
}
