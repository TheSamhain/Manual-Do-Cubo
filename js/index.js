const main = document.getElementById('root');
const LOCAL = 'cidade.one';
let dono = true;

validaToken(localStorage.getItem('login'))
    .then(autenticado => {
        if (!autenticado) {
            carregarLogin();
        } else {
            carregarHome();
        }
    });