document.addEventListener("DOMContentLoaded", () => {
  const btnAssistirDepois = document.getElementById("btn-assistir-depois");
  const btnJaAssistido = document.getElementById("btn-ja-assistido");

  if (!btnAssistirDepois || !btnJaAssistido) {
    console.error("❌ Botões não encontrados no DOM");
    return;
  }

  // 🔐 token salvo no login
  const token = localStorage.getItem("token");

  // 🎬 id do filme (ex: vindo da URL ?id=123)
  const params = new URLSearchParams(window.location.search);
  const filmeId = params.get("id");

  if (!token || !filmeId) {
    console.error("❌ Token ou filmeId não encontrados");
    return;
  }

  /* =========================
     VERIFICAR STATUS
  ========================= */
  async function verificarStatus() {
    try {
      const res = await fetch(
        `https://tcc-cinematch.onrender.com/filmes/status/${filmeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) return;

      const status = await res.json();

      btnAssistirDepois.classList.toggle("ativo", status.assistirDepois);
      btnJaAssistido.classList.toggle("ativo", status.jaAssistido);

    } catch (err) {
      console.error("Erro ao verificar status:", err);
    }
  }

  /* =========================
     ASSISTIR DEPOIS
  ========================= */
  btnAssistirDepois.addEventListener("click", async () => {
    const ativo = btnAssistirDepois.classList.contains("ativo");

    try {
      const url = ativo
        ? `https://tcc-cinematch.onrender.com/filmes/assistir-depois/${filmeId}`
        : `https://tcc-cinematch.onrender.com/filmes/assistir-depois`;

      const options = {
        method: ativo ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      if (!ativo) {
        options.body = JSON.stringify({ tmdb_id: filmeId });
      }

      const res = await fetch(url, options);

      if (res.ok) {
        btnAssistirDepois.classList.toggle("ativo", !ativo);
      }

    } catch (err) {
      console.error("Erro Assistir Depois:", err);
    }
  });

  /* =========================
     JÁ ASSISTIDO
  ========================= */
  btnJaAssistido.addEventListener("click", async () => {
    const ativo = btnJaAssistido.classList.contains("ativo");

    try {
      const url = ativo
        ? `https://tcc-cinematch.onrender.com/filmes/ja-assistidos/${filmeId}`
        : `https://tcc-cinematch.onrender.com/filmes/ja-assistidos`;

      const options = {
        method: ativo ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      if (!ativo) {
        options.body = JSON.stringify({ tmdb_id: filmeId });
      }

      const res = await fetch(url, options);

      if (res.ok) {
        btnJaAssistido.classList.toggle("ativo", !ativo);
      }

    } catch (err) {
      console.error("Erro Já Assistido:", err);
    }
  });

  verificarStatus();
});
