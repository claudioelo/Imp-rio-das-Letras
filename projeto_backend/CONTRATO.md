# Contrato da API - XYZ Bookstore

Livro: `{ id, titulo, autor, descricao, preco }`
Item do carrinho: `{ livroId, quantidade, titulo, preco, subtotal }`
Erro: sempre `{ erro: "mensagem" }` em JSON

| # | Rota | Método | Body | OK | Erros | Auditoria |
|---|------|--------|------|----|-------|-----------|
| 1 | `/livros` | GET | — | 200 `[{livro}]` | — | ✔ |
| 2 | `/livros?autor=X` | GET | — | 200 `[{livro}]` (pode ser `[]`) | — | ✔ |
| 3 | `/livros/:id` | GET | — | 200 `{livro}` | 404 `{erro: "livro nao encontrado"}` | ✔ |
| 4 | `/carrinho` | GET | — | 200 `[{item}]` | — | ✔ |
| 5 | `/carrinho` | POST | `{livroId, quantidade}` | 201 `{item, carrinho}` com item enriquecido | 400 campo faltando / livro inexistente / quantidade invalida / JSON quebrado | ✔ |
| 6 | `/checkout` | POST | — | 200 `{numero, itens, total}` | 400 `{erro: "carrinho vazio"}` | ✔ |
| 7 | qualquer outra | * | — | — | 404 `{erro: "rota inexistente"}` | ✔ |
| 8 | `/carrinho/:id` | DELETE | — | 200 `[{item}]` (carrinho restante) | 404 `{erro: "item nao esta no carrinho: <id>"}` | ✔ |

## Desvios encontrados
- Linha 5: o POST /carrinho devolvia `item` sem `titulo`, `preco` e `subtotal`. Corrigido no app.js.

## Decisões
- Linha 8 usa 404, e não 400: o DELETE não tem corpo, só aponta pro endereço `/carrinho/:id`. Se o item não está no carrinho, o recurso não existe.