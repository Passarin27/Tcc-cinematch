/* =========================
   LOGIN
========================= */
const API = "http://192.168.1.6:3333";


async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Email ou senha inválidos");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    window.location.href = "home.html";
  } catch (error) {
    alert("Erro de conexão com o servidor");
  }
}

/* =========================
   CADASTRO
========================= */
async function registrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha })
  });

  if (!res.ok) {
    alert("Erro ao cadastrar");
    return;
  }

  alert("Conta criada com sucesso!");
  window.location.href = "index.html";
}
