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

const carrinho = [];

const servidor = http.createServer((req, res) => {
    const [caminho, query] = req.url.split("?");  //"/livros?autor=ana" -> "/livros" + "autor=ana"
    const params = new URLSearchParams(query || "");
    const partes = caminho.split("/"); // ["", "livros", "sally-adventure-book"]
    const json = { "Content-Type": "application/json; charset=utf-8" };

    if (caminho === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Bem-vindo a API da XYZ Bookstore");
    }

    if (caminho === "/livros" && req.method === "GET") {
        const autor = params.get("autor");
        const lista = autor
            ? livros.filter((livro) => livro.autor.toLowerCase().includes(autor.toLowerCase()))
            : livros;
        res.writeHead(200, json);
        return res.end(JSON.stringify(lista));
    }

    if (partes[1] === "livros" && partes[2] && req.method === "GET") {
        const livro = livros.find((item) => item.id === partes[2]);
        if (livro) {
          res.writeHead(200, json);
          return res.end(JSON.stringify(livro));
        } 
        res.writeHead(404, json);
        return res.end(JSON.stringify({ erro: "livro nao encontrado"}));        
    
    }
    
    if (caminho === "/carrinho" &&  req.method === "GET") {
        res.writeHead(200, json);
        return res.end(JSON.stringify(carrinho));    
    } 
    
    if (caminho === "/carrinho" && req.method === "POST") {
        let bruto = "";
        req.on("data", (pedaco) => {
            bruto += pedaco;
        });
        req.on("end", () => {
            const item = JSON.parse(bruto);
            carrinho.push(item);
            res.writeHead(200,json);
            res.end(JSON.stringify({carrinho}));

        });
        return;     
    }

    res.writeHead(404, json);
    res.end(JSON.stringify({erro: "rota inexistente"}));
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");