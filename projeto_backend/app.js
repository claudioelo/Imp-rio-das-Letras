const express = require("express");
const app = express();

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
// lista (com filtro opcional por autor)
app.get("/livros", (req, res) => {
    const autor = req.query.autor;
    const lista = autor
        ? livros.filter((livro) => livro.autor.toLowerCase().includes(autor.toLowerCase()))
        : livros;
    res.json(lista);

});
//datalhe
app.get("/livros/:id", (req, res) => {
    const livro = livros.find((item) => item.id === req.params.id);
    if (!livro) return res.status(404).json({ erro: "livro nao encontrado" });
    res.json(livro);
});

app.use((req, res) => {
    res.status(404).json({ erro: "rota inexistente "});
});

app.listen(3000, () => console.log("XYZ Bookstore (Express) no ar em http://localhost:3000"));