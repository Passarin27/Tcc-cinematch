const API_KEY = "1ed547b4243d008478f0754b4621dbe2";
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`;
const IMG_URL = "https://image.tmdb.org/t/p/w300";

/* =========================
   LOGIN (SIMPLES)
========================= */
function abrirLogin() {
  const modal = document.getElementById("modalLogin");
  if (modal) modal.style.display = "flex";
}

function fecharLogin() {
  const modal = document.getElementById("modalLogin");
  if (modal) modal.style.display = "none";
}

function login() {
  // Simula login OK
  window.location.href = "home.html";
}

/* =========================
   FILMES (CATÁLOGO)
========================= */
async function carregarFilmes() {
  const container = document.getElementById("lista-filmes");
  if (!container) return;

  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();

    container.innerHTML = "";

    dados.results.forEach(filme => {
      const div = document.createElement("div");
      div.classList.add("filme");

      div.innerHTML = `
        <img src="${IMG_URL + filme.poster_path}" alt="${filme.title}">
        <h3>${filme.title}</h3>
        <a href="detalhes.html?id=${filme.id}" class="btn">Ver detalhes</a>
      `;

      container.appendChild(div);
    });

  } catch (erro) {
    container.innerHTML = "<p>Erro ao carregar filmes.</p>";
    console.error(erro);
  }
}
// Carregar nome e foto no topo
const nomeTopo = document.getElementById("nomeTopo");
const fotoTopo = document.getElementById("fotoTopo");

if (nomeTopo && localStorage.getItem("nomeUsuario")) {
  nomeTopo.textContent = localStorage.getItem("nomeUsuario");
}

if (fotoTopo && localStorage.getItem("fotoUsuario")) {
  fotoTopo.src = localStorage.getItem("fotoUsuario");
}

/* =========================
   INICIALIZA
========================= */
carregarFilmes();
