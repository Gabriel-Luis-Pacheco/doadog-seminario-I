-- Cães de exemplo para o aplicativo não ficar vazio (todos fictícios)
-- Para colocar: psql -U postgres -d doadog -f exemplos.sql

set client_encoding to 'UTF8';

-- conta de exemplo, dona dos cães abaixo (ninguém responde as mensagens dela)
insert into usuarios (nome, email, senha) values
('Equipe DoaDog (exemplo)', 'equipe@doadog.exemplo', 'conta-de-exemplo');

insert into caes (nome, descricao, porte, sexo, idade, cidade, uf, contato, foto) values
('Mel', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Pequeno', 'Fêmea', '2 anos', 'São Paulo', 'SP', 'Equipe DoaDog (exemplo)', 'mel.jpg'),
('Bento', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Médio', 'Macho', '5 anos', 'Santo André', 'SP', 'Equipe DoaDog (exemplo)', 'bento.jpg'),
('Nina', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Pequeno', 'Fêmea', '1 ano', 'São Paulo', 'SP', 'Equipe DoaDog (exemplo)', 'nina.jpg'),
('Tobias', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Grande', 'Macho', '8 anos', 'Guarulhos', 'SP', 'Equipe DoaDog (exemplo)', 'tobias.jpg'),
('Amora', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Médio', 'Fêmea', '3 anos', 'Osasco', 'SP', 'Equipe DoaDog (exemplo)', 'amora.jpg'),
('Caju', 'EXEMPLO: perfil fictício só para testar o aplicativo. Não é um cão real para adoção.', 'Grande', 'Macho', '6 anos', 'São Paulo', 'SP', 'Equipe DoaDog (exemplo)', 'caju.jpg');

insert into pedidos (titulo, descricao, meta, pix) values
('Ração para cães resgatados (exemplo)', 'EXEMPLO: pedido fictício só para mostrar como a tela de doações funciona.', 300, 'exemplo@doadog.com');

-- liga os exemplos à conta de exemplo
update caes set usuario_id = (select id from usuarios where email = 'equipe@doadog.exemplo') where usuario_id is null;
update pedidos set usuario_id = (select id from usuarios where email = 'equipe@doadog.exemplo') where usuario_id is null;
