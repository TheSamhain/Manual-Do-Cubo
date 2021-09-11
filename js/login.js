const carregarLogin = async () => {
  localStorage.removeItem('login.' + param);

  let html = await fetch('template/login.html');
  html = await html.text();
  app.innerHTML = html;


  let form = document.getElementById('login').getElementsByTagName('form')[0];
  form.addEventListener('submit', (e) => e.preventDefault());

  carregarLogo();
}

/**
 * 
 * @param {HTMLInputElement} input 
 */
const onFocus = (input) => {
  const parent = input.parentElement,
    label = parent.querySelector('span');

  label.style.transform = 'translate3D(0, -15px, 0)';
}

/**
 * 
 * @param {HTMLInputElement} input 
 */
const onLostFocus = (input) => {
  const parent = input.parentElement,
    label = parent.querySelector('span');

  if (input.value == '') {
    label.style.transform = 'translate3D(0, 5px, 0)';
  }
}

const entrar = () => {
  const senha = document.getElementById('senha').value,
    usuario = document.getElementById('usuario').value;

  if (senha == '') {
    alert('Insira a senha');
    return;
  }

  if (usuario == '') {
    alert('Insira o usuario');
    return;
  }

  let formData = new FormData();
  formData.append('USUARIO', usuario.toUpperCase());
  formData.append('SENHA', senha.toUpperCase());
  formData.append('LOCAL', LOCAL);

  fetch('backend/login/login.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {
      if (json.logado) {
        localStorage.setItem('login.' + param, json.token);
        carregarMain();
      } else {
        if (!json.erro) {
          alert('Erro ao realizar login, tente novamente mais tarde.');
        } else {
          alert(json.erro);
        }
      }
    })
    .catch(err => {
      console.log(err);
      alert('Erro:\n\n' + err.message);
    })
}