const http = require("node:http");

const servidor = http.createServer((req, res) => {
    //console.log("Pedido recebido em: " + req.url);

    let mensagem;
    let status;


    if (req.url === "/") {
        status =200;
        mensagem = "Bem-vindo a API da XYZ Bookstore";

    }else if (req.url === "/livros") {
        status = 200;
        mensagem = "Rota de livros - em construcao";

    }else if (req.url === "/carrinho") {
        status = 200;
        mensagem = "Rota do carrinho - em construcao";

    }else {
        status = 404;
        mensagem = "Endereco nao encontrado";
    }    

    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8"});
    res.end(mensagem);
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");