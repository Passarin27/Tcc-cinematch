function editarNome() {
  document.getElementById("nomeInput").hidden = false;
}

function editarEmail() {
  document.getElementById("emailInput").hidden = false;
}

function editarSenha() {
  document.getElementById("senhaInput").hidden = false;
}

function editarFoto() {
  document.getElementById("fotoInput").click();
}

function salvarTudo() {
  const nome = document.getElementById("nomeInput").value;
  const email = document.getElementById("emailInput").value;
  const senha = document.getElementById("senhaInput").value;

  if (nome) {
    localStorage.setItem("nomeUsuario", nome);
    document.getElementById("nomeAtual").textContent = nome;
  }

  if (email) {
    localStorage.setItem("emailUsuario", email);
    document.getElementById("emailAtual").textContent = email;
  }

  if (senha) {
    localStorage.setItem("senhaUsuario", senha);
  }

  const fotoInput = document.getElementById("fotoInput");
  if (fotoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem("fotoUsuario", reader.result);
      document.getElementById("fotoPerfil").src = reader.result;
    };
    reader.readAsDataURL(fotoInput.files[0]);
  }

  alert("Dados atualizados com sucesso!");
}
