const API_KEY = "1ed547b4243d008478f0754b4621dbe2";
const IMG_URL = "https://image.tmdb.org/t/p/w400";

// pega o ID do filme
const params = new URLSearchParams(window.location.search);
const filmeId = params.get("id");

async function carregarDetalhes() {
    if (!filmeId) return;

    // dados principais
    const filmeResp = await fetch(
        `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${API_KEY}&language=pt-BR`
    );
    const filme = await filmeResp.json();

    // atores e diretor
    const creditosResp = await fetch(
        `https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=${API_KEY}&language=pt-BR`
    );
    const creditos = await creditosResp.json();

    // diretor
    const diretor = creditos.crew.find(p => p.job === "Director");

    // atores (3 principais)
    const atores = creditos.cast
        .slice(0, 3)
        .map(a => a.name)
        .join(", ");

    // gêneros
    const generos = filme.genres.map(g => g.name).join(", ");

    // preencher tela
    document.getElementById("poster").src = IMG_URL + filme.poster_path;
    document.getElementById("titulo").textContent = filme.title;
    document.getElementById("sinopse").textContent = filme.overview || "Sinopse não disponível.";
    document.getElementById("generos").textContent = "Gênero: " + generos;
    document.getElementById("diretor").textContent = diretor ? diretor.name : "Não informado";
    document.getElementById("atores").textContent = atores;
}
function toggleFavorito() {
    const coracao = document.getElementById("favorito");
    coracao.classList.toggle("ativo");

    // Simulação de salvar
    if (coracao.classList.contains("ativo")) {
        localStorage.setItem("filmeSalvo", "true");
    } else {
        localStorage.removeItem("filmeSalvo");
    }
}

carregarDetalhes();
