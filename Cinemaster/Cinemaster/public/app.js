document.addEventListener('DOMContentLoaded', async () => {
  const isPaginaDetalhes = window.location.pathname.includes("detalhes.html");

  if (isPaginaDetalhes) {
    carregarDetalhesDoFilme();
  } else {
    await carregarFilmesDaHome();
    configurarPesquisa();
  }
});

// ============================
// PÁGINA INICIAL
// ============================
async function carregarFilmesDaHome() {
  try {
    const resposta = await fetch('db/json/filmes.json');
    const filmes = await resposta.json();

    const categorias = {
      "Lançamento": "lista-lancamentos",
      "Populares": "lista-populares",
      "Em Breve": "lista-em-breve",
      "Por Gênero": "lista-generos",
      "Clássicos": "lista-classicos"
    };

    for (const [status, containerId] of Object.entries(categorias)) {
      const filtrados = filmes.filter(filme => filme.status === status);
      gerarCards(filtrados, containerId);
    }
  } catch (erro) {
    console.error("Erro ao carregar os filmes:", erro);
  }
}

function gerarCards(filmes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = filmes.map(filme => `
    <div class="card">
      <img src="${filme.imagem}" alt="${filme.titulo}">
      <h3>${filme.titulo}</h3>
      <p>${filme.genero}</p>
      <p><span class="avaliacao">${filme.avaliacao}</span> <i class="fas fa-star"></i></p>
      <a href="detalhes.html?id=${filme.id}">Ver Detalhes</a>
    </div>
  `).join("");
}

function configurarPesquisa() {
  const campoPesquisa = document.getElementById('input-pesquisa');
  if (!campoPesquisa) return;

  campoPesquisa.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    filtrarFilmes(termo);
  });
}

function filtrarFilmes(termo) {
  const filmesContainers = document.querySelectorAll('.cards');

  filmesContainers.forEach(container => {
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
      const titulo = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = titulo.includes(termo) ? 'block' : 'none';
    });
  });
}

// ============================
// PÁGINA DE DETALHES
// ============================
async function carregarDetalhesDoFilme() {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) return;

  const resposta = await fetch('db/json/filmes.json');
  const filmes = await resposta.json();
  const filme = filmes.find(f => f.id == movieId);

  const container = document.getElementById("detalhes-filme");

  if (filme) {
    container.innerHTML = `
      <h2>${filme.titulo}</h2>
      <img src="${filme.imagem}" alt="${filme.titulo}">
      <p><strong>Gênero:</strong> ${filme.genero}</p>
      <p><strong>Sinopse:</strong> ${filme.sinopse}</p>
      <a href="index.html">Voltar</a>
    `;
  } else {
    container.innerHTML = "<p>Filme não encontrado.</p>";
  }
}