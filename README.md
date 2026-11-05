# DoaDog

Aplicativo para ajudar na adoção de cães e em pedidos de doação. Projeto da FECITI 2026.

O aplicativo é feito com React Native (Expo). O servidor é feito com Node, Express e PostgreSQL.

## O que o aplicativo faz

- **Adoção:** mostra os cães, com busca por nome ou cidade, e a página de cada cão. Quem está logado pode clicar em "Tenho interesse".
- **Doações:** mostra pedidos de ajuda, deixa criar um pedido novo e registrar que quer ajudar. O aplicativo **não faz pagamento**: ele só mostra a chave Pix de quem pediu.
- **Cadastrar:** cadastra um cão com foto, porte, sexo, cidade e descrição.
- **Chat:** conversa simples entre duas pessoas sobre um cão (botão "Conversar" na página do cão). As mensagens atualizam a cada 5 segundos.
- **Perfil:** login, criar conta, editar os dados e ver os cães e ajudas da pessoa.

Os cães e o pedido que já vêm no banco são de exemplo (fictícios).

## Como rodar

Precisa ter o Node.js e o PostgreSQL instalados.

### 1. Banco de dados

```bash
psql -U postgres -c "create database doadog"
psql -U postgres -d doadog -f servidor/banco.sql
psql -U postgres -d doadog -f servidor/exemplos.sql
```

### 2. Servidor

Abra o arquivo `servidor/servidor.js` e troque `sua_senha` pela senha do seu PostgreSQL.

```bash
cd servidor
npm install
npm start
```

O servidor fica em `http://localhost:3333`.

### 3. Aplicativo

```bash
npm install
npm run web
```

Para testar no celular (Expo Go), o celular e o computador precisam estar na mesma rede Wi-Fi. Crie um arquivo `.env` na pasta principal com o IP do computador:

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333
```

Depois rode `npm start` e leia o QR code com o Expo Go.

## Pastas

- `App.js`: abas e telas do aplicativo
- `src/telas`: uma tela por arquivo
- `src/componentes`: botão, campo de texto e outras peças pequenas
- `src/api.js`: conversa com o servidor
- `servidor/servidor.js`: rotas do servidor
- `servidor/banco.sql`: tabelas do PostgreSQL

## Limitações

- A senha é guardada sem criptografia no banco. Serve só para demonstração.
- Não existe pagamento dentro do aplicativo.
- O aplicativo não foi testado com muitos usuários.
