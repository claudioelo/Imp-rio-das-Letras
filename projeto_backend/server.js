const http = require("node:http");


const livros = [
    {titulo: "A Aventura de Sally", autor: "Ana Ribeiro", preco: 39.9},
    {titulo: "A Aventura Culinária de Dave", autor: "Carlos Mendes", preco: 49.9},
];

const servidor = http.createServer((req, res) => {
    //console.log("Pedido recebido em: " + req.url);

    let mensagem;
    let status;
    let tipo


    if (req.url === "/") {
        status =200;
        tipo =  "text/plain; charset=utf-8";
        mensagem = "Bem-vindo a API da XYZ Bookstore";

    }else if (req.url === "/livros") {
        status = 200;
        tipo = "application/json; charset=utf-8";
        mensagem = JSON.stringify(livros);

    }else if (req.url === "/carrinho") {
        status = 200;
        tipo = "text/plain; charset=utf-8"; 
        mensagem = "Rota do carrinho - em construcao";

    }else {
        status = 404;
        tipo = "application/json; charset=utf-8";
        mensagem = JSON.stringify({ erro: "rota inexistente"});
    }    

    res.writeHead(status, { "Content-Type": tipo });
    res.end(mensagem);
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");