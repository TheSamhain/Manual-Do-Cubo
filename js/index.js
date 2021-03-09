const main = document.getElementById('root');
const LOCAL = 'cidade.one';

validaToken(localStorage.getItem('login'))
.then(autenticado => {
    if(!autenticado){
        carregarLogin();
    } else {
        carregarHome();
    }
});