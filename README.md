# GPS-Router

GPS-Router é um app React construído com Vite para ajudar a montar e otimizar rotas com vários endereços. O usuário adiciona destinos, o sistema calcula a melhor ordem de visita usando geocodificação e depois abre a rota no Google Maps ou no Waze.

## Como funciona

1. O app recebe uma lista de endereços informados pelo usuário.
2. Para cada endereço, ele consulta a API de geocodificação do OpenRouteService e converte o texto em coordenadas geográficas.
3. Os pontos são otimizados localmente para reduzir deslocamentos, usando uma heurística de vizinho mais próximo.
4. O resultado final contém os endereços na ordem otimizada.
5. O usuário pode abrir a rota no Google Maps ou no Waze diretamente a partir do app.

## Recursos

- Adiciona múltiplos endereços ao percurso.
- Busca sugestões de endereço usando o Nominatim do OpenStreetMap.
- Calcula uma rota otimizada entre todas as paradas.
- Permite abrir o destino final no Google Maps ou Waze.
- Exibe mensagens de erro quando a chave da API ou o cálculo de rota falham.

## Requisitos

- Node.js 18 ou superior
- Chave de API do OpenRouteService (`VITE_ORS_API_KEY`)

## Instalação

1. Copie o arquivo `.env.example` para `.env` (ou crie um novo `.env`).
2. Adicione sua chave do OpenRouteService:

```env
VITE_ORS_API_KEY=your_openrouteservice_api_key_here
```

3. Instale as dependências:

```bash
npm install
```

## Uso

- `npm run dev` — inicia o servidor de desenvolvimento.
- `npm run build` — gera a versão de produção.
- `npm run preview` — pré-visualiza o build de produção.
- `npm run lint` — executa o ESLint.

## Observações

- O app depende do OpenRouteService para geocodificação e cálculo de rota.
- As sugestões de endereço usam a API pública do Nominatim e estão limitadas a consultas simples.
- O botão de otimização exige ao menos dois endereços para gerar a rota.
