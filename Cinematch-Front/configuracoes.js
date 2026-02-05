const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* =========================
   GÊNEROS (UI)
========================= */
const allGenres = [
  "Ação",
  "Drama",
  "Comédia",
  "Terror",
  "Ficção Científica",
  "Romance",
  "Animação",
  "Fantasia",
  "Suspense"
];

let selectedGenres = []; // sempre normalizado (minúsculo)

/* =========================
   NORMALIZAÇÃO
========================= */
function normalizarGenero(g) {
  return g
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function formatarGenero(g) {
  return g
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

/* =========================
   CARREGAR USUÁRIO
========================= */
async function carregarUsuario() {
  const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    showToast("Erro ao carregar usuário", "erro");
    return;
  }

  const usuario = await res.json();

  document.getElementById("nomeAtual").textContent = usuario.nome;
  document.getElementById("emailAtual").textContent = usuario.email;

  if (usuario.foto) {
    document.getElementById("fotoPerfil").src = usuario.foto;
  }

  if (Array.isArray(usuario.preferences)) {
    selectedGenres = usuario.preferences;
    document.getElementById("generosAtuais").textContent =
      selectedGenres.map(formatarGenero).join(", ");
  }

  renderSelected();
}

carregarUsuario();

/* =========================
   SALVAR BACKEND
========================= */
let saveTimeout = null;

async function salvarPreferenciasAutomatico() {
  clearTimeout(saveTimeout);

  saveTimeout = setTimeout(async () => {
    if (!selectedGenres.length) return;

    const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ preferences: selectedGenres })
    });

    if (!res.ok) {
      showToast("Erro ao salvar preferências", "erro");
      return;
    }

    document.getElementById("generosAtuais").textContent =
      selectedGenres.map(formatarGenero).join(", ");

    showToast("Preferências atualizadas", "sucesso");
  }, 400);
}

/* =========================
   TOGGLE DO SELETOR
========================= */
function editarPreferencias() {
  const container = document.getElementById("generoContainer");
  container.hidden = !container.hidden;
}

/* =========================
   DROPDOWN
========================= */
const input = document.getElementById("genreInput");
const dropdown = document.getElementById("genreDropdown");
const selectedContainer = document.getElementById("selectedGenres");

function renderDropdown() {
  dropdown.innerHTML = "";

  allGenres.forEach(nome => {
    const valor = normalizarGenero(nome);
    if (!selectedGenres.includes(valor)) {
      const div = document.createElement("div");
      div.className = "genre-option";
      div.textContent = nome;
      div.onclick = () => addGenre(valor);
      dropdown.appendChild(div);
    }
  });
}

function renderSelected() {
  selectedContainer.innerHTML = "";

  selectedGenres.forEach(g => {
    const tag = document.createElement("div");
    tag.className = "genre-tag";
    tag.innerHTML = `${formatarGenero(g)} <span>×</span>`;
    tag.querySelector("span").onclick = () => removeGenre(g);
    selectedContainer.appendChild(tag);
  });
}

function addGenre(g) {
  if (selectedGenres.includes(g)) return;

  selectedGenres.push(g);
  renderSelected();
  renderDropdown();
  dropdown.style.display = "none";

  salvarPreferenciasAutomatico();
}

function removeGenre(g) {
  selectedGenres = selectedGenres.filter(x => x !== g);
  renderSelected();
  renderDropdown();

  salvarPreferenciasAutomatico();
}

input.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
  renderDropdown();
});

document.addEventListener("click", e => {
  if (!e.target.closest(".genre-select")) {
    dropdown.style.display = "none";
  }
});

function editarFoto() {
  document.getElementById("fotoInput").click();
}

document.getElementById("fotoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file); // nome esperado pelo backend

  try {
    const res = await fetch(
      "https://tcc-cinematch.onrender.com/users/me/avatar",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    if (!res.ok) {
      showToast("Erro ao atualizar avatar", "erro");
      return;
    }

    const data = await res.json();

    // atualiza imagem na tela
    document.getElementById("fotoPerfil").src = data.avatar;

    showToast("Avatar atualizado com sucesso", "sucesso");
  } catch (err) {
    showToast("Erro de conexão", "erro");
  }
});

function removerFoto() {
  document.getElementById("fotoPerfil").src = "./avatar.png";
  showToast("Avatar removido", "info");
}


function editarNome() {
  const input = document.getElementById("nomeInput");
  input.hidden = false;
  input.focus();

  input.onblur = async () => {
    if (!input.value.trim()) return;

    const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nome: input.value })
    });

    if (res.ok) {
      document.getElementById("nomeAtual").textContent = input.value;
      showToast("Nome atualizado", "sucesso");
    } else {
      showToast("Erro ao atualizar nome", "erro");
    }

    input.hidden = true;
    input.value = "";
  };
}


function editarEmail() {
  const input = document.getElementById("emailInput");
  input.hidden = false;
  input.focus();

  input.onblur = async () => {
    if (!input.value.trim()) return;

    const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email: input.value })
    });

    if (res.ok) {
      document.getElementById("emailAtual").textContent = input.value;
      showToast("E-mail atualizado", "sucesso");
    } else {
      showToast("Erro ao atualizar e-mail", "erro");
    }

    input.hidden = true;
    input.value = "";
  };
}

function editarSenha() {
  const input = document.getElementById("senhaInput");
  input.hidden = false;
  input.focus();

  input.onblur = async () => {
    if (input.value.length < 6) {
      showToast("Senha muito curta", "erro");
      return;
    }

    const res = await fetch("https://tcc-cinematch.onrender.com/users/me/senha", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ senha: input.value })
    });

    if (res.ok) {
      showToast("Senha atualizada", "sucesso");
    } else {
      showToast("Erro ao atualizar senha", "erro");
    }

    input.hidden = true;
    input.value = "";
  };
}


/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   TOAST
========================= */
function showToast(msg, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = msg;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

