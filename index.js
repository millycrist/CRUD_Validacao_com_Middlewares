const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let pessoas = [
  { id: 1, nome: 'João', idade: 20, email: 'joao@email.com', telefone: '61900010002' },
  { id: 2, nome: 'Maria', idade: 25, email: 'maria@email.com', telefone: '61900010003' }
];

// Middleware para validar se todos os atributos estão presentes
function validarAtributos(req, res, next) {
  const { nome, idade, email, telefone } = req.body;
  if (!nome || !idade || !email || !telefone) {
    return res.status(400).json({ message: 'Todos os atributos devem ser preenchidos' });
  }
  next();
}

// Middleware para verificar se a pessoa existe
function verificarPessoa(req, res, next) {
  const pessoaId = parseInt(req.params.id);
  const pessoa = pessoas.find((p) => p.id === pessoaId);
  if (!pessoa) {
    return res.status(404).json({ message: 'Pessoa não encontrada' });
  }
  next();
}

app.get('/pessoas', (req, res) => {
  res.json(pessoas);
});

app.get('/pessoas/:id', verificarPessoa, (req, res) => {
  const pessoaId = parseInt(req.params.id);
  const pessoa = pessoas.find((p) => p.id === pessoaId);
  res.json(pessoa);
});

app.post('/pessoas', validarAtributos, (req, res) => {
  const { nome, idade, email, telefone } = req.body;
  const pessoa = { id: pessoas.length + 1, nome, idade, email, telefone };
  pessoas.push(pessoa);
  res.status(201).json(pessoa);
});

app.put('/pessoas/:id', validarAtributos, verificarPessoa, (req, res) => {
  const { nome, idade, email, telefone } = req.body;
  const pessoaId = parseInt(req.params.id);
  const pessoaIndex = pessoas.findIndex((p) => p.id === pessoaId);
  pessoas[pessoaIndex] = { id: pessoaId, nome, idade, email, telefone };
  res.json(pessoas[pessoaIndex]);
});

app.delete('/pessoas/:id', verificarPessoa, (req, res) => {
  const pessoaId = parseInt(req.params.id);
  const pessoaIndex = pessoas.findIndex((p) => p.id === pessoaId);
  pessoas.splice(pessoaIndex, 1);
  res.json({ message: 'Pessoa removida' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
