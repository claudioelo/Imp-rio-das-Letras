const API = "http://localhost:3000";
const container = document.querySelector(".card-container");
const carrinhoView = document.querySelector("#carrinho-view");
const mensagem = document.querySelector("#mensagem");

// ---------- LIVROS (Step 18) ----------
function montarCard(livro) {
    return `
    <div class="card" id="${livro.id}">
      <h2>${livro.titulo}</h2>
      <p>${livro.autor}</p>
      <p>${livro.descricao}</p>
      <p class="preco">R$ ${livro.preco.toFixed(2)}</p>
      <button class="btn buy-now" data-id="${livro.id}">Buy Now</button>
    </div>`;
}

async function carregarLivros() {
    const resposta = await fetch(API + "/livros");
    const livros = await resposta.json();
    container.innerHTML = "";
    livros.forEach((livro) => container.insertAdjacentHTML("beforeend", montarCard(livro)));
}
carregarLivros();

// ---------- COMPRAR (Step 18) ----------
container.addEventListener("click", async (evento) => {
    const btn = evento.target.closest(".buy-now");
    if (!btn) return;
    const resposta = await fetch(API + "/carrinho", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ livroId: btn.dataset.id, quantidade: 1 }),
    });
    const dados = await resposta.json();
    if (!resposta.ok) {
        mensagem.textContent = "Erro: " + dados.erro;
        return;
    }
    mensagem.textContent = "Adicionado: " + dados.item.titulo;
});

// ---------- VER CARRINHO (Step 19) ----------
function renderizarCarrinho(itens) {
    if (itens.length === 0) {
        carrinhoView.innerHTML = "<p>Carrinho vazio.</p>";
        return;
    }
    carrinhoView.innerHTML = itens
        .map((item) => `
      <p>
        ${item.titulo} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${item.subtotal.toFixed(2)}
        <button class="btn remover" data-id="${item.livroId}">Remover</button>
      </p>`)
        .join("");
}

async function carregarCarrinho() {
    const resposta = await fetch(API + "/carrinho");
    const itens = await resposta.json();
    renderizarCarrinho(itens);
}

document.querySelector("#view-cart-btn").addEventListener("click", () => {
    mensagem.textContent = "";
    carregarCarrinho();
});

// ---------- REMOVER (Step 19) - delegação no carrinho-view ----------
carrinhoView.addEventListener("click", async (evento) => {
    const btn = evento.target.closest(".remover");
    if (!btn) return;
    const resposta = await fetch(API + "/carrinho/" + btn.dataset.id, { method: "DELETE" });
    const dados = await resposta.json();
    if (!resposta.ok) {
        mensagem.textContent = "Erro: " + dados.erro;
        return;
    }
    mensagem.textContent = "Item removido.";
    renderizarCarrinho(dados); // o DELETE já devolve o carrinho que sobrou
});

// ---------- CHECKOUT (Step 19) ----------
document.querySelector("#checkout-btn").addEventListener("click", async () => {
    const resposta = await fetch(API + "/checkout", { method: "POST" });
    const dados = await resposta.json();
    if (!resposta.ok) {
        mensagem.textContent = "Erro: " + dados.erro; // erro NA TELA, não só no console
        return;
    }
    mensagem.textContent = `Pedido nº ${dados.numero} finalizado! Total: R$ ${dados.total.toFixed(2)}`;
    carrinhoView.innerHTML = "";
});