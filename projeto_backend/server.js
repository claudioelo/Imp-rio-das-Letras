const http = require("node:http");

const servidor = http.createServer((req, res) => {
    //console.log("Pedido recebido em: " + req.url);

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end("<h1>Livraria da Cidade</h1><p>Bem-vindo à XYZ Bookstore!</p>");
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");