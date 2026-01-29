const API_KEY = "1ed547b4243d008478f0754b4621dbe2";
const TMDB_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=`;
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const API = "https://tcc-cinematch.onrender.com";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

let pagina = 1;
let filmesVisiveis = 0;

/* =========================
   MAPA DE GÊNEROS
========================= */
const GENEROS = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  27: "Terror",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção científica",
  53: "Suspense"
};

/* =========================
   USUÁRIO
========================= */
async function carregarUsuario() {
  const res = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await res.json();
  if (user.foto) document.getElementById("fotoTopo").src = user.foto;
}

/* =========================
   FAVORITOS
========================= */
async function buscarFavoritos() {
  const res = await fetch(`${API}/filmes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const filmes = await res.json();
  return filmes.map(f => f.tmdb_id);
}

/* =========================
   RECOMENDAÇÕES
========================= */
async function mostrarRecomendacoes() {
  ativarTab(0);
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";
  filmesVisiveis = 0;

  const favoritos = await buscarFavoritos();

  while (filmesVisiveis < 10) {
    const res = await fetch(TMDB_URL + pagina);
    const data = await res.json();

    for (const filme of data.results) {
      if (!filme.poster_path) continue;
      if (favoritos.includes(filme.id)) continue;
      if (filmesVisiveis >= 10) break;

      const generoNome = GENEROS[filme.genre_ids?.[0]] || "—";
      const ano = filme.release_date
        ? filme.release_date.split("-")[0]
        : "—";

      const sinopse = filme.overview
        ? filme.overview.substring(0, 120) + "..."
        : "Sinopse não disponível.";

      const card = document.createElement("div");
      card.className = "filme-card";

      card.innerHTML = `
        <img src="${IMG_URL + filme.poster_path}">
        <div class="filme-info">
          <h3>${filme.title}</h3>
          <small>${ano} • ${generoNome}</small>
          <p class="sinopse">${sinopse}</p>
        </div>
        <span class="coracao" onclick="favoritar(this, ${filme.id}, '${filme.title}', '${filme.poster_path}')">❤</span>
      `;

      conteudo.appendChild(card);
      filmesVisiveis++;
    }

    pagina++;
  }
}

/* =========================
   FAVORITAR
========================= */
async function favoritar(el, id, titulo, poster) {
  el.classList.add("ativo");

  await fetch(`${API}/filmes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      tmdb_id: id,
      titulo,
      poster: IMG_URL + poster
    })
  });

  el.closest(".filme-card").remove();
  filmesVisiveis--;

  if (filmesVisiveis < 10) {
    mostrarRecomendacoes();
  }
}

/* =========================
   LISTAS
========================= */
function mostrarListas() {
  ativarTab(1);
  document.getElementById("conteudo").innerHTML =
    "<p style='padding:16px'>Minhas listas em breve</p>";
}

/* =========================
   AUX
========================= */
function ativarTab(i) {
  document.querySelectorAll(".tab").forEach((t, idx) => {
    t.classList.toggle("ativo", idx === i);
  });
}

function irConfig() {
  window.location.href = "../configuracoes.html";
}

/* =========================
   INIT
========================= */
carregarUsuario();
mostrarRecomendacoes();
