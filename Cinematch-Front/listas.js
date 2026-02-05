const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const API_URL = "https://tcc-cinematch.onrender.com";

/* =========================
   USUÁRIO TOPO
========================= */
async function carregarUsuarioTopo() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return;

  const usuario = await res.json();

  document.getElementById("nomeTopo").textContent = usuario.nome;
  if (usuario.foto) {
    document.getElementById("fotoTopo").src = usuario.foto;
  }
}

/* =========================
   LISTAS
========================= */
async function carregarListas() {
  const res = await fetch(`${API_URL}/listas`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const listas = await res.json();
  const container = document.getElementById("listas");

  container.innerHTML = "";

  if (!listas.length) {
    container.innerHTML = "<p>Você ainda não tem listas.</p>";
    return;
  }

  for (const lista of listas) {
    const section = document.createElement("section");
    section.className = "lista-card";

    section.innerHTML = `
      <header class="lista-header">
        <h3>${lista.nome}</h3>
      </header>
      <div class="lista-filmes" id="lista-${lista.id}">
        <p class="carregando">Carregando...</p>
      </div>
    `;

    container.appendChild(section);
    carregarFilmesDaLista(lista.id);
  }
}

/* =========================
   FILMES DA LISTA
========================= */
async function carregarFilmesDaLista(listaId) {
  const res = await fetch(`${API_URL}/listas/${listaId}/filmes`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const filmes = await res.json();
  const container = document.getElementById(`lista-${listaId}`);

  container.innerHTML = "";

  if (!filmes.length) {
    container.innerHTML = "<p class='lista-vazia'>Lista vazia</p>";
    return;
  }

  filmes.forEach(filme => {
    const card = document.createElement("div");
    card.className = "filme-card";

    card.innerHTML = `
      <img src="${filme.poster}" alt="${filme.titulo}">
      <span>${filme.titulo}</span>
    `;

    card.onclick = () => {
      window.location.href = `detalhes.html?id=${filme.tmdb_id}&from=listas`;
    };

    container.appendChild(card);
  });
}

/* =========================
   INIT
========================= */
(async () => {
  await carregarUsuarioTopo();
  await carregarListas();
})();
