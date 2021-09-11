const exibirSenha = () => {
  const
    senha1 = document.getElementsByName('novaSenha1')[0],
    senha2 = document.getElementsByName('novaSenha2')[0],
    mostrarSenha = document.getElementById('mostrar-senha'),
    iconeOlho = mostrarSenha.querySelector('i'),
    textoMostraSenha = mostrarSenha.querySelector('span');

  let type = senha1.type == "password" ? "text" : "password";
  senha1.type = type;
  senha2.type = type;

  if (type == 'text') {
    iconeOlho.className = 'bi bi-eye-slash-fill';
    textoMostraSenha.innerHTML = 'Esconder senha';
  } else {
    iconeOlho.className = 'bi bi-eye-fill';
    textoMostraSenha.innerHTML = 'Mostrar senha';
  }
}

const salvarInfoUsuario = () => {
  const inputs = document.getElementsByTagName('input');

  let infos = {}

  for (input of inputs) {
    if (input.name != "mostrarSenha") {
      infos[input.name] = input.value.toUpperCase();
    }
  }

  if (!infos.novaSenha1 || !infos.novaSenha2 || !infos.senhaAtual) {
    alert("Todas as senhas devem ser inseridas");
    return;
  }

  if (infos.novaSenha1 != infos.novaSenha2) {
    alert("As senhas não conferem");
    return;
  }

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);
  formData.append('INFOS', JSON.stringify(infos));

  fetch('backend/perfil/salvarPerfil.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {
      if (!json.autenticado) {
        alert(json.erro ? `Erro ao cadastrar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return false;
      }

      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return false;
      }

      alert("Senha atualizada");

      for (input of inputs) {
        if (input.name != "mostrarSenha") {
          input.value = '';
        }
      }
    })

}