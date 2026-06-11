# Avatares

Coloque aqui as imagens dos personagens.

O nome esperado pelo codigo e o valor do campo `imagePath` em `src/features/lobby/types.ts`.

Exemplo atual:

```ts
{
  id: "emanuel",
  label: "emanuel",
  gradient: "from-red-500 to-rose-900",
  imagePath: "/avatars/mamel.png",
}
```

Esse exemplo procura o arquivo:

```txt
public/avatars/mamel.png
```

Se quiser trocar uma imagem, voce pode:

- substituir o arquivo mantendo o mesmo nome; ou
- colocar outro arquivo aqui e atualizar `imagePath` em `src/features/lobby/types.ts`.

Depois de adicionar ou trocar imagens, reinicie o dev server se o navegador continuar mostrando cache antigo.
