document.addEventListener('DOMContentLoaded', async () => {
  const isPaginaDetalhes = window.location.pathname.includes("/public/detalhes.html");

  if (isPaginaDetalhes) {
    carregarDetalhesDoFilme();
  } else {
    await carregarFilmesDaHome();
    configurarPesquisa();
  }

  aplicarTemaSalvoOuAutomatico();
  configurarBotaoTema();
});

// ============================
// PÁGINA INICIAL
// ============================
async function carregarFilmesDaHome() {
  try {
    const resposta = await fetch('db/json/filmes.json');
    if (!resposta.ok) throw new Error("Arquivo JSON não encontrado.");
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

    aplicarEventosNosCards();
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

  try {
    const resposta = await fetch('/db/json/filmes.json');
    if (!resposta.ok) throw new Error("Arquivo JSON não encontrado.");
    const filmes = await resposta.json();
    const filme = filmes.find(f => f.id == movieId);

    const container = document.getElementById("detalhes-filme");

    if (filme) {
      container.innerHTML = `
        <h2>${filme.titulo}</h2>
        <img src="${filme.imagem}" alt="${filme.titulo}">
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p><strong>Sinopse:</strong> ${filme.descricao}</p>
        <a href="index.html">Voltar</a>
      `;
    } else {
      container.innerHTML = "<p>Filme não encontrado.</p>";
    }
  } catch (erro) {
    console.error("Erro ao carregar detalhes do filme:", erro);
  }
}

// ============================
// TEMA CLARO/ESCURO
// ============================
function configurarBotaoTema() {
  const botaoTema = document.getElementById('botao-tema');
  if (!botaoTema) return;

  botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('tema-escuro');
    localStorage.setItem('tema', document.body.classList.contains('tema-escuro') ? 'escuro' : 'claro');
    atualizarIconeTema();
  });

  atualizarIconeTema();
}

function atualizarIconeTema() {
  const iconeTema = document.getElementById('icone-tema');
  if (!iconeTema) return;

  if (document.body.classList.contains('tema-escuro')) {
    iconeTema.textContent = '☀️';
  } else {
    iconeTema.textContent = '🌙';
  }
}

function aplicarTemaSalvoOuAutomatico() {
  const temaSalvo = localStorage.getItem('tema');
  const hora = new Date().getHours();

  if (temaSalvo === 'escuro' || (!temaSalvo && (hora >= 18 || hora < 6))) {
    document.body.classList.add('tema-escuro');
  }

  // Injetar estilo adicional do tema escuro
  const estiloTemaEscuro = document.createElement('style');
  estiloTemaEscuro.innerHTML = `
    .tema-escuro {
        background-color: #121212;
        color: white;
    }
    .tema-escuro .banner {
        background-color: #333;
    }
    .tema-escuro .card {
        background-color: #444;
        border-color: #666;
    }
  `;
  document.head.appendChild(estiloTemaEscuro);
}

// ============================
// INTERAÇÕES VISUAIS
// ============================
function aplicarEventosNosCards() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.3)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = 'none';
    });
  });
}
