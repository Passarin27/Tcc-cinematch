const API_URL = "https://tcc-cinematch.onrender.com";

let selectedGenres = [];

/* =========================
   SELEÇÃO DE GENEROS
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".genre").forEach(btn => {
    btn.addEventListener("click", () => {
      const genre = btn.textContent.trim();

      if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(g => g !== genre);
        btn.classList.remove("active");
      } else {
        selectedGenres.push(genre);
        btn.classList.add("active");
      }
    });
  });
});

/* =========================
   LOGIN
========================= */
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    alert("Email ou senha inválidos");
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  window.location.href = "home.html";
}

/* =========================
   REGISTRO
========================= */
async function registrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      email,
      senha,
      preferences: selectedGenres
    })
  });

  if (!res.ok) {
    alert("Erro ao cadastrar");
    return;
  }

  alert("Cadastro realizado com sucesso");
  window.location.href = "index.html";
}
