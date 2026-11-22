// ACHAR + MUDAR
const titulo = document.querySelector("#titulo");
const textoStatus = document.querySelector("#status");
titulo.textContent = "XYZ Bookstore";
textoStatus.textContent = "Nenhum livro clicado ainda";

// dados locais (ensaio do Step 18, que vai trocar isso por fetch)
const livros = [
  { id: "sally-adventure-book", titulo: "A Aventura de Sally", preco: 39.9 },
  { id: "dave-cooking-book", titulo: "A Aventura Culinária de Dave", preco: 49.9 },
];

// GERAR: array -> HTML
const lista = document.querySelector("#lista");
function renderizar() {
  lista.innerHTML = livros
    .map((livro) => `<li>${livro.titulo} - R$ ${livro.preco.toFixed(2)} <button class="buy-now" data-id="${livro.id}">Buy Now</button></li>`)
    .join("");
}
renderizar();

// OUVIR com delegação: UM listener no <ul>, serve pra todos os botões
let total = 0;
const contador = document.querySelector("#contador");
lista.addEventListener("click", (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return; // clicou fora de um botão: ignora
  total++;
  contador.textContent = `Cliques: ${total}`;
  textoStatus.textContent = `Último clicado: ${btn.dataset.id}`;
  console.log("clicou:", btn.dataset.id);
});

// pra provar a delegação: recria a lista e o clique continua funcionando
document.querySelector("#re-renderizar").addEventListener("click", renderizar);