// Servidor do DoaDog (Express + PostgreSQL).
// As tabelas estão no arquivo banco.sql.
// Para iniciar: npm install e depois npm start

const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

// Troque "sua_senha" pela senha do seu PostgreSQL,
// ou use a variável de ambiente DATABASE_URL
const banco = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres:sua_senha@localhost:5432/doadog",
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" })); // 5mb porque a foto chega em base64
app.use("/fotos", express.static(path.join(__dirname, "fotos")));

// Express 4 não pega erro de função async sozinho, então uso isto nas rotas
function rota(funcao) {
  return (req, res, next) => {
    funcao(req, res, next).catch((erro) => {
      console.log(erro);
      res.status(500).json({ erro: "Erro no servidor." });
    });
  };
}

// Cria um token novo para o usuário e guarda na tabela sessoes
async function criarSessao(usuarioId) {
  const token = crypto.randomUUID();
  await banco.query("insert into sessoes (token, usuario_id) values ($1, $2)", [
    token,
    usuarioId,
  ]);
  return token;
}

// Confere o token enviado pelo aplicativo
const exigirLogin = rota(async (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const resultado = await banco.query(
    `select u.id, u.nome, u.email, u.telefone, u.cidade
     from sessoes s join usuarios u on u.id = s.usuario_id
     where s.token = $1`,
    [token]
  );
  if (resultado.rows.length === 0) {
    return res.status(401).json({ erro: "Faça login para continuar." });
  }
  req.usuario = resultado.rows[0];
  next();
});

// ---------- Conta ----------

app.post(
  "/cadastro",
  rota(async (req, res) => {
    const { nome, email, senha, telefone, cidade } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha nome, e-mail e senha." });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: "A senha precisa ter 6 letras ou mais." });
    }
    const jaExiste = await banco.query("select id from usuarios where email = $1", [
      email.toLowerCase(),
    ]);
    if (jaExiste.rows.length > 0) {
      return res.status(400).json({ erro: "Esse e-mail já está cadastrado." });
    }
    // A senha fica salva sem criptografia porque é só um projeto de demonstração.
    const novo = await banco.query(
      `insert into usuarios (nome, email, senha, telefone, cidade)
       values ($1, $2, $3, $4, $5)
       returning id, nome, email, telefone, cidade`,
      [nome, email.toLowerCase(), senha, telefone || "", cidade || ""]
    );
    const token = await criarSessao(novo.rows[0].id);
    res.json({ token, usuario: novo.rows[0] });
  })
);

app.post(
  "/login",
  rota(async (req, res) => {
    const { email, senha } = req.body;
    const resultado = await banco.query(
      `select id, nome, email, telefone, cidade from usuarios
       where email = $1 and senha = $2`,
      [(email || "").toLowerCase(), senha]
    );
    if (resultado.rows.length === 0) {
      return res.status(400).json({ erro: "E-mail ou senha incorretos." });
    }
    const token = await criarSessao(resultado.rows[0].id);
    res.json({ token, usuario: resultado.rows[0] });
  })
);

app.put(
  "/perfil",
  exigirLogin,
  rota(async (req, res) => {
    const { nome, telefone, cidade } = req.body;
    const resultado = await banco.query(
      `update usuarios set nome = $1, telefone = $2, cidade = $3
       where id = $4
       returning id, nome, email, telefone, cidade`,
      [nome || req.usuario.nome, telefone || "", cidade || "", req.usuario.id]
    );
    res.json(resultado.rows[0]);
  })
);

// ---------- Cães ----------

app.get(
  "/caes",
  rota(async (req, res) => {
    const busca = "%" + (req.query.busca || "") + "%";
    const resultado = await banco.query(
      `select * from caes
       where nome ilike $1 or cidade ilike $1
       order by id desc`,
      [busca]
    );
    res.json(resultado.rows);
  })
);

app.get(
  "/caes/:id",
  rota(async (req, res) => {
    const resultado = await banco.query("select * from caes where id = $1", [
      req.params.id,
    ]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Cão não encontrado." });
    }
    res.json(resultado.rows[0]);
  })
);

app.post(
  "/caes",
  exigirLogin,
  rota(async (req, res) => {
    const { nome, descricao, porte, sexo, idade, cidade, uf, contato, foto } = req.body;
    if (!nome || !descricao || !cidade) {
      return res.status(400).json({ erro: "Preencha nome, descrição e cidade." });
    }
    const resultado = await banco.query(
      `insert into caes (nome, descricao, porte, sexo, idade, cidade, uf, contato, foto, usuario_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning *`,
      [
        nome,
        descricao,
        porte || "Médio",
        sexo || "Macho",
        idade || "",
        cidade,
        uf || "",
        contato || req.usuario.nome,
        foto || "",
        req.usuario.id,
      ]
    );
    res.json(resultado.rows[0]);
  })
);

app.get(
  "/meus-caes",
  exigirLogin,
  rota(async (req, res) => {
    const resultado = await banco.query(
      "select * from caes where usuario_id = $1 order by id desc",
      [req.usuario.id]
    );
    res.json(resultado.rows);
  })
);

app.post(
  "/caes/:id/interesse",
  exigirLogin,
  rota(async (req, res) => {
    await banco.query(
      `insert into interesses (cao_id, usuario_id) values ($1, $2)
       on conflict do nothing`,
      [req.params.id, req.usuario.id]
    );
    res.json({ ok: true });
  })
);

// ---------- Chat ----------

// Lista as conversas da pessoa (uma por cão e por pessoa)
app.get(
  "/conversas",
  exigirLogin,
  rota(async (req, res) => {
    const resultado = await banco.query(
      `select distinct on (m.cao_id, outro.id)
         m.cao_id, c.nome as cao, outro.id as outro_id,
         outro.nome as outro_nome, m.texto as ultima
       from mensagens m
       join caes c on c.id = m.cao_id
       join usuarios outro on outro.id =
         (case when m.remetente_id = $1 then m.destinatario_id else m.remetente_id end)
       where m.remetente_id = $1 or m.destinatario_id = $1
       order by m.cao_id, outro.id, m.id desc`,
      [req.usuario.id]
    );
    res.json(resultado.rows);
  })
);

// Mensagens entre eu e outra pessoa sobre um cão
app.get(
  "/mensagens",
  exigirLogin,
  rota(async (req, res) => {
    const resultado = await banco.query(
      `select * from mensagens
       where cao_id = $1
         and ((remetente_id = $2 and destinatario_id = $3)
           or (remetente_id = $3 and destinatario_id = $2))
       order by id`,
      [req.query.cao, req.usuario.id, req.query.com]
    );
    res.json(resultado.rows);
  })
);

app.post(
  "/mensagens",
  exigirLogin,
  rota(async (req, res) => {
    const { caoId, paraId, texto } = req.body;
    if (!texto || !texto.trim()) {
      return res.status(400).json({ erro: "Escreva uma mensagem." });
    }
    await banco.query(
      `insert into mensagens (cao_id, remetente_id, destinatario_id, texto)
       values ($1, $2, $3, $4)`,
      [caoId, req.usuario.id, paraId, texto.trim()]
    );
    res.json({ ok: true });
  })
);

// ---------- Doações ----------
// Não passa dinheiro pelo app: o pedido mostra a chave Pix de quem precisa
// e o botão "Quero ajudar" só registra a intenção.

app.get(
  "/pedidos",
  rota(async (req, res) => {
    const resultado = await banco.query(
      `select p.*, u.nome as responsavel,
         (select count(*) from ajudas a where a.pedido_id = p.id)::int as pessoas
       from pedidos p left join usuarios u on u.id = p.usuario_id
       order by p.id desc`
    );
    res.json(resultado.rows);
  })
);

app.post(
  "/pedidos",
  exigirLogin,
  rota(async (req, res) => {
    const { titulo, descricao, meta, pix } = req.body;
    if (!titulo || !descricao) {
      return res.status(400).json({ erro: "Preencha o título e a descrição." });
    }
    const resultado = await banco.query(
      `insert into pedidos (titulo, descricao, meta, pix, usuario_id)
       values ($1, $2, $3, $4, $5) returning *`,
      [titulo, descricao, parseInt(meta) || 0, pix || "", req.usuario.id]
    );
    res.json(resultado.rows[0]);
  })
);

app.post(
  "/pedidos/:id/ajuda",
  exigirLogin,
  rota(async (req, res) => {
    const { tipo, valor, mensagem } = req.body;
    await banco.query(
      `insert into ajudas (pedido_id, usuario_id, tipo, valor, mensagem)
       values ($1, $2, $3, $4, $5)`,
      [req.params.id, req.usuario.id, tipo || "Dinheiro", parseInt(valor) || 0, mensagem || ""]
    );
    res.json({ ok: true });
  })
);

app.get(
  "/minhas-ajudas",
  exigirLogin,
  rota(async (req, res) => {
    const resultado = await banco.query(
      `select a.*, p.titulo as pedido
       from ajudas a join pedidos p on p.id = a.pedido_id
       where a.usuario_id = $1 order by a.id desc`,
      [req.usuario.id]
    );
    res.json(resultado.rows);
  })
);

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, "0.0.0.0", () => {
  console.log("Servidor do DoaDog rodando na porta " + PORTA);
});
