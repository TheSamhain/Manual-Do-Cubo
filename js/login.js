const carregarLogin = async () => {
    localStorage.removeItem('login.' + param);
    
    let html = await fetch('template/login.html');
    html = await html.text();
    main.innerHTML = html;
    
    
    let form = document.getElementById('login').getElementsByTagName('form')[0];
    form.addEventListener('submit', (e) => e.preventDefault());

    carregarLogo();
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

    fetch('backend/login.php', {
        method: 'POST',
        body: formData,
    })
        .then(resp => resp.json())
        .then(json => {
            if (json.logado) {
                localStorage.setItem('login.' + param, json.token);                
                carregarHome();
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