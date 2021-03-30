const sair = () => {
  localStorage.removeItem('login.' + param);
  carregarLogin();
}

const exibirSenha = (exibir) => {
  const
    senha1 = document.getElementsByName('senha1')[0],
    senha2 = document.getElementsByName('senha2')[0];

  senha1.type = exibir ? "text" : "password";
  senha2.type = exibir ? "text" : "password";
}

const salvarInfoUsuario = () => {
  const inputs = document.getElementsByTagName('input');

  let infos = {}

  for(input of inputs){
    if(input.name != "mostrarSenha"){
      infos[input.name] = input.value;
    }
  }

  console.log(infos);
}