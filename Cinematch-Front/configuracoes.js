const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* =========================
   GÊNEROS
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

let selectedGenres = [];

/* =========================
   CARREGAR USUÁRIO
========================= */
async function carregarUsuario() {
  const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    showToast("Erro ao carregar dados do usuário.", "erro");
    return;
  }

  const usuario = await res.json();

  document.getElementById("nomeAtual").textContent = usuario.nome;
  document.getElementById("emailAtual").textContent = usuario.email;

  if (usuario.foto) {
    document.getElementById("fotoPerfil").src = usuario.foto;
  }

  if (Array.isArray(usuario.preferences) && usuario.preferences.length > 0) {
    selectedGenres = usuario.preferences;
    document.getElementById("generosAtuais").textContent =
      selectedGenres.join(", ");
  }
}

carregarUsuario();

/* =========================
   SALVAR BACKEND
========================= */
async function salvarBackend(dados) {
  const res = await fetch("https://tcc-cinematch.onrender.com/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados)
  });

  if (!res.ok) {
    const err = await res.json();
    showToast(err.error || "Erro ao salvar alterações.", "erro");
    return false;
  }

  return true;
}

/* =========================
   EDITAR NOME
========================= */
async function editarNome() {
  const input = document.getElementById("nomeInput");

  if (input.hidden) {
    input.hidden = false;
    input.focus();
    return;
  }

  if (!input.value) return;

  const ok = await salvarBackend({ nome: input.value });
  if (ok) {
    document.getElementById("nomeAtual").textContent = input.value;
    showToast("Nome atualizado com sucesso!", "sucesso");
  }

  input.hidden = true;
}

/* =========================
   EDITAR EMAIL
========================= */
async function editarEmail() {
  const input = document.getElementById("emailInput");

  if (input.hidden) {
    input.hidden = false;
    input.focus();
    return;
  }

  if (!input.value) return;

  const ok = await salvarBackend({ email: input.value });
  if (ok) {
    document.getElementById("emailAtual").textContent = input.value;
    showToast("E-mail atualizado com sucesso!", "sucesso");
  }

  input.hidden = true;
}

/* =========================
   EDITAR SENHA
========================= */
async function editarSenha() {
  const input = document.getElementById("senhaInput");

  if (input.hidden) {
    input.hidden = false;
    input.focus();
    return;
  }

  if (!input.value || input.value.length < 6) {
    showToast("A senha deve ter no mínimo 6 caracteres.", "erro");
    return;
  }

  const ok = await salvarBackend({ senha: input.value });
  if (ok) {
    showToast("Senha alterada com sucesso!", "sucesso");
    input.value = "";
  }

  input.hidden = true;
}

/* =========================
   FOTO
========================= */
const fotoInput = document.getElementById("fotoInput");
const fotoPerfil = document.getElementById("fotoPerfil");

function editarFoto() {
  fotoInput.click();
}

fotoInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("foto", file);

  try {
    const res = await fetch(
      "https://tcc-cinematch.onrender.com/users/me/avatar",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      }
    );

    if (!res.ok) throw new Error();

    const data = await res.json();
    fotoPerfil.src = data.foto;
    showToast("Foto atualizada com sucesso!", "sucesso");

  } catch {
    showToast("Erro ao enviar imagem. Tente novamente.", "erro");
  }
});

async function removerFoto() {
  if (!confirm("Deseja remover sua foto de perfil?")) return;

  const res = await fetch(
    "https://tcc-cinematch.onrender.com/users/me/avatar",
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    showToast("Erro ao remover a foto.", "erro");
    return;
  }

  fotoPerfil.src = "./avatar.png";
  showToast("Foto removida com sucesso!", "sucesso");
}

/* =========================
   EDITAR GÊNEROS
========================= */
function editarPreferencias() {
  const container = document.getElementById("generoContainer");
  const atual = document.getElementById("generosAtuais");

  if (container.hidden) {
    container.hidden = false;
    return;
  }

  if (selectedGenres.length === 0) {
    showToast("Selecione pelo menos um gênero.", "erro");
    return;
  }

  salvarBackend({ preferences: selectedGenres });
  atual.textContent = selectedGenres.join(", ");
  container.hidden = true;

  showToast("Preferências atualizadas!", "sucesso");
}

/* =========================
   DROPDOWN GÊNEROS
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("genreInput");
  const dropdown = document.getElementById("genreDropdown");
  const selectedContainer = document.getElementById("selectedGenres");

  function renderDropdown() {
    dropdown.innerHTML = "";
    allGenres
      .filter(g => !selectedGenres.includes(g))
      .forEach(genre => {
        const div = document.createElement("div");
        div.className = "genre-option";
        div.textContent = genre;
        div.onclick = () => addGenre(genre);
        dropdown.appendChild(div);
      });
  }

  function renderSelected() {
    selectedContainer.innerHTML = "";
    selectedGenres.forEach(genre => {
      const tag = document.createElement("div");
      tag.className = "genre-tag";
      tag.innerHTML = `${genre} <span>×</span>`;
      tag.querySelector("span").onclick = () => removeGenre(genre);
      selectedContainer.appendChild(tag);
    });
  }

  function addGenre(genre) {
    selectedGenres.push(genre);
    renderSelected();
    renderDropdown();
  }

  function removeGenre(genre) {
    selectedGenres = selectedGenres.filter(g => g !== genre);
    renderSelected();
    renderDropdown();
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

  renderSelected();
});

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
function showToast(mensagem, tipo = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensagem;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
