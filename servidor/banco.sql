-- Tabelas do DoaDog (PostgreSQL)
-- Para criar: psql -U postgres -d doadog -f banco.sql

set client_encoding to 'UTF8';

create table if not exists usuarios (
  id serial primary key,
  nome text not null,
  email text unique not null,
  senha text not null,
  telefone text,
  cidade text
);

-- cada login gera um token que fica guardado aqui
create table if not exists sessoes (
  token text primary key,
  usuario_id integer references usuarios(id)
);

create table if not exists caes (
  id serial primary key,
  nome text not null,
  descricao text not null,
  porte text,
  sexo text,
  idade text,
  cidade text not null,
  uf text,
  contato text,
  foto text,
  usuario_id integer references usuarios(id)
);

create table if not exists interesses (
  id serial primary key,
  cao_id integer references caes(id),
  usuario_id integer references usuarios(id),
  unique (cao_id, usuario_id)
);

-- mensagens do chat: uma conversa é entre duas pessoas sobre um cão
create table if not exists mensagens (
  id serial primary key,
  cao_id integer references caes(id),
  remetente_id integer references usuarios(id),
  destinatario_id integer references usuarios(id),
  texto text not null
);

create table if not exists pedidos (
  id serial primary key,
  titulo text not null,
  descricao text not null,
  meta integer,
  pix text,
  usuario_id integer references usuarios(id)
);

create table if not exists ajudas (
  id serial primary key,
  pedido_id integer references pedidos(id),
  usuario_id integer references usuarios(id),
  tipo text,
  valor integer,
  mensagem text
);
