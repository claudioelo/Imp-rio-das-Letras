const express = require("express");
const app = express();

app.use(express.json()); // lê o corpo JSON e coloca em req.body: ANTES das rotas

const livros = [
    {
        id: "sally-adventure-book",
        titulo: "A Aventura de Sally",
        autor: "Ana Ribeiro",
        descricao: "Uma história épica de Sally e seu cachorro Rex enquanto eles viajam por outros mundos.",
        preco: 39.9,
    },
    {
        id: "dave-cooking-book",
        titulo: "A Aventura Culinária de Dave",
        autor: "Carlos Mendes",
        descricao: "A história de David, que aprende a preparar de tudo, de panquecas a massas, uma receita de cada vez.",
        preco: 49.9,
    },
];

const carrinho = [];
const pedidos = [];

function montarItens() {
    return carrinho.map((itemCarrinho) => {
        const livro = livros.find((item) => item.id === itemCarrinho.livroId);
        return {
            ...itemCarrinho,
            titulo: livro.titulo,
            preco: livro.preco,
            subtotal: livro.preco * itemCarrinho.quantidade,
        };
    });
}

// lista (com filtro opcional por autor)
app.get("/livros", (req, res) => {
    const autor = req.query.autor;
    const lista = autor
        ? livros.filter((livro) => livro.autor.toLowerCase().includes(autor.toLowerCase()))
        : livros;
    res.json(lista);
});

// detalhe
app.get("/livros/:id", (req, res) => {
    const livro = livros.find((item) => item.id === req.params.id);
    if (!livro) return res.status(404).json({ erro: "livro nao encontrado" });
    res.json(livro);
});

app.get("/carrinho", (req, res) => {
    res.json(montarItens());
});

app.post("/carrinho", (req, res) => {
    const dados = req.body || {}; // Express 5: sem JSON, req.body vem undefined

    const faltando = [];
    if (!dados.livroId) faltando.push("livroId");
    if (dados.quantidade === undefined) faltando.push("quantidade");
    if (faltando.length > 0) {
        return res.status(400).json({ erro: "faltam campos: " + faltando.join(", ") });
    }

    const livro = livros.find((item) => item.id === dados.livroId);
    if (!livro) return res.status(400).json({ erro: "livro inexistente: " + dados.livroId });

    if (!(Number.isInteger(dados.quantidade) && dados.quantidade > 0)) {
        return res.status(400).json({ erro: "quantidade deve ser um numero inteiro maior que zero" });
    }

    const item = { livroId: dados.livroId, quantidade: dados.quantidade };
    carrinho.push(item);
    res.status(201).json({ item, carrinho });
});

app.post("/checkout", (req, res) => {
    if (carrinho.length === 0) return res.status(400).json({ erro: "carrinho vazio" });
    const itens = montarItens();
    const total = itens.reduce((soma, item) => soma + item.subtotal, 0);
    const pedido = { numero: Date.now(), itens, total };
    pedidos.push(pedido);
    carrinho.length = 0;
    res.json(pedido);
});

app.get("/pedidos", (req, res) => {
    res.json(pedidos);
});

// 404 pra qualquer rota que não bateu acima
app.use((req, res) => {
    res.status(404).json({ erro: "rota inexistente" });
});

// tratador de erros: 4 parâmetros, depois de tudo
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "corpo nao e JSON valido" });
    }
    res.status(500).json({ erro: "falha interna" });
});

app.listen(3000, () => console.log("XYZ Bookstore (Express) no ar em http://localhost:3000"));