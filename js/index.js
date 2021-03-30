const
    app = document.getElementById('root'),
    param = new URLSearchParams(window.location.search).get('local'),
    LOCAL = param + '.one';

var dono = true;

if (param) {
    validaToken(localStorage.getItem('login.' + param))
        .then(autenticado => {
            if (!autenticado) {
                carregarLogin();
            } else {
                carregarMain();
            }
        });
} else {
    carregarLocais();
}

const carregarLogo = async () => {
    // Carrega a logo da ONE
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