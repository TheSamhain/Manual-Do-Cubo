const carregarLogin = async () => {
    localStorage.removeItem('login');
    
    let html = await fetch('template/login.html');
    html = await html.text();
    main.innerHTML = html;
    
    
    let form = document.getElementById('login').getElementsByTagName('form')[0];
    form.addEventListener('submit', (e) => e.preventDefault());

    let logoTarget = document.getElementById('logo-target');
    let logo = await fetch('assets/logo-one.xml');
    logo = await logo.text();

    logoTarget.innerHTML = logo;

    let t1 = anime.timeline({
        complete: () => {
            anime({
                targets: '#logo path, #Consorcio',
                easing: 'linear',
                loop: false,
                fill: '#1a3c62'
            });
        }
    });

    t1.add({
        targets: '#logo path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        direction: 'alternate',
        duration: 1000,
        loop: false,
    })
    
    t1.remove('#Consorcio');
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
                localStorage.setItem('login', json.token);                
                carregarHome();
            } else {
                if (!json.erro) {
                    alert('Erro ao realizar login, tente novamente mais tarde.');
                } else {
                    alert(json.erro);
                }
            }
        })
}