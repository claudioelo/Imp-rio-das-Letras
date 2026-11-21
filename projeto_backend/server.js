const http = require("node:http");
const { URLSearchParams } = require("node:url");

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

const servidor = http.createServer((req, res) => {
    const [caminho, query] = req.url.split("?");  //"/livros?autor=ana" -> "/livros" + "autor=ana"
    const params = new URLSearchParams(query || "");
    const partes = caminho.split("/"); // ["", "livros", "sally-adventure-book"]


    let corpo;
    let status = 200;
    let tipo = "application/json; charset=utf-8";



    if (caminho === "/") {
        tipo = "text/plain; charset=utf-8";
        corpo = "Bem-vindo a API da XYZ Bookstore";
    } else if (caminho === "/livros") {
        const autor = params.get("autor"); //null se não veio
        const lista = autor
            ? livros.filter((livro) => livro.autor.toLowerCase().includes(autor.toLowerCase()))
            : livros;
        corpo = JSON.stringify(lista);
    } else if (partes[1] === "livros" && partes[2]) {
    const livro = livros.find((l) => l.id === partes[2]);
    if (livro) {
        corpo = JSON.stringify(livro);
    } else {
        status = 404;
        corpo = JSON.stringify({ erro: "livro nao encontrado" });
    }
} else if (caminho === "/carrinho") {
    tipo = "text/plain; charset=utf-8";
    corpo = "Rota do carrinho - em construcao";
} else {
    status = 404;
    corpo = JSON.stringify({ erro: "rota inexistente" });
}

res.writeHead(status, { "Content-Type": tipo });
res.end(corpo);
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");