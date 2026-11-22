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
const pedidos = [];

function enviar(res, status, corpo) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(corpo));
}

// Junta cada item do carrinho com os dados do livro (titulo, preco, subtotal)
function  montarItens() {
    return carrinho.map((itemCarrinho) => {
        const livro = livros.find((item) => item.id === itemCarrinho.livroId);
        return{
            ...itemCarrinho,
            titulo: livro.titulo,
            preco: livro.preco,
            subtotal: livro.preco * itemCarrinho.quantidade,
        };
    });
}
function adicionarAoCarrinho(req, res) {
    let bruto = "";
    req.on("data", (pedaco) => {
        bruto += pedaco;
    });
    req.on("end", () => {
        let dados;
        try {
            dados = JSON.parse(bruto); //camada 1: é JSON?
        } catch {
            return enviar(res, 400, {erro: "corpo nao e JSON valido" });
        }

        if (!dados || typeof dados !==  "object") {
            return enviar(res, 400, { erro: "corpo deve ser um objeto com livroId e quantidade" });
        }

        const faltando = []; //camada 2: campos obrigatórios?
        if (!dados.livroId) faltando.push("livroId");
        if (dados.quantidade === undefined) faltando.push("quantidade");
        if (faltando.length > 0) {

            return enviar(res, 400, { erro: "faltam campos: " + faltando.join(", ") });
        }

        const  livro = livros.find((item) => item.id === dados.livroId); // camada 3: o livro existe?
        if (!livro) {
            return enviar(res, 400, { erro: "livro inexistente: " + dados.livroId });
        }

        if (!(Number.isInteger(dados.quantidade) && dados.quantidade > 0)) { // camada 4: quantidade
            return enviar(res, 400, { erro: "quantidade deve ser um numero inteiro maior que zero" });
        }

        const item = { livroId: dados.livroId, quantidade: dados.quantidade };
        carrinho.push(item);
        enviar(res, 201, { item, carrinho }); // criou -> 201
    });
}

const servidor = http.createServer((req, res) => {
    const [caminho, query] = req.url.split("?");  //"/livros?autor=ana" -> "/livros" + "autor=ana"
    const params = new URLSearchParams(query || "");
    const partes = caminho.split("/"); // ["", "livros", "sally-adventure-book"]
    
    if (caminho === "/" && req.method === "GET") {
        return enviar(res, 200, { mensagem: "Bem-vindo a API da XYZ Bookstore" });
    }

    if (caminho === "/livros" && req.method === "GET") {
        const autor = params.get("autor");
        const lista = autor
            ? livros.filter((livro) => livro.autor.toLowerCase().includes(autor.toLowerCase()))
            : livros;      
        return enviar(res, 200, lista);
    }

    if (partes[1] === "livros" && partes[2] && req.method === "GET") {
        const livro = livros.find((item) => item.id === partes[2]);
        if (livro) {          
          return enviar(res, 200, livro);
        } 
     
        return enviar(res, 404, { erro: "livro nao encontrado"});        
    
    }
    
    if (caminho === "/carrinho" &&  req.method === "GET") {       
        return enviar(res, 200,montarItens());    
    } 
    
    if (caminho === "/carrinho" && req.method === "POST") {
       return adicionarAoCarrinho(req, res);
    }

    if (caminho === "/checkout" && req.method === "POST" ) {
        if (carrinho.length === 0) {
            return enviar(res, 400, { erro: "carrinho vazio"});
        }
        const itens = montarItens();
        const total = itens.reduce((soma, item) => soma + item.subtotal, 0);
        const pedido = { numero: Date.now(), itens, total};
        pedidos.push(pedido);
        carrinho.length = 0; // esvazia o MESMO array
        return enviar(res, 200, pedido);
    }

    if (caminho === "/pedidos" && req.method === "GET") {
        return enviar(res, 200, pedidos);
    }

    enviar(res, 404, {erro: "rota inexistente" });
});

servidor.listen(3000);

console.log("XYZ Bookstore no ar em http://localhost:3000");