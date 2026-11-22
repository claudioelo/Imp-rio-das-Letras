const API = "http://localhost:3000";
const container = document.querySelector(".card-container");

// monta o HTML de um card, na mesma estrutura do projeto2
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

// CARREGAR: busca os livros na API e gera os cards
async function carregarLivros() {
  const resposta = await fetch(API + "/livros");
  const livros = await resposta.json();
  container.innerHTML = "";
  livros.forEach((livro) => container.insertAdjacentHTML("beforeend", montarCard(livro)));
}
carregarLivros();

// COMPRAR: um listener só, no container (delegação)
container.addEventListener("click", async (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return;
  const resposta = await fetch(API + "/carrinho", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ livroId: btn.dataset.id, quantidade: 1 }),
  });
  if (!resposta.ok) {
    const { erro } = await resposta.json();
    return console.log("RECUSADO PELO SERVIDOR:", erro);
  }
  const dados = await resposta.json();
  console.log("Adicionado:", dados.item.titulo, "| itens no carrinho:", dados.carrinho.length);
});