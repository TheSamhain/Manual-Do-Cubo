const carregarHome = async () => {
    validaToken(localStorage.getItem('login'), true);

    let html = await fetch('template/home.html');
    html = await html.text();
    main.innerHTML = html;

    telaNovaVenda();
}

const sair = () => {
    localStorage.removeItem('login');
    carregarLogin();
}


const telaNovoCliente = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login'), true);

    let html = await fetch('template/novoCliente.html');
    html = await html.text();
    content.innerHTML = html;

    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', cadastrarCliente);

    document.getElementById('titulo').innerHTML = "Cadastro de cliente";

    evitarEspacosInputs();

}

const telaNovaVenda = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login'), true);

    let html = await fetch('template/novaVenda.html');
    html = await html.text();
    content.innerHTML = html;

    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', cadastrarVenda);

    document.getElementById('titulo').innerHTML = "Cadastro de venda";

    evitarEspacosInputs();

    let dataAdesao = document.getElementsByName('dataAdesao')[0],
        today = new Date(),
        dd = String(today.getDate()).padStart(2, '0'),
        mm = String(today.getMonth() + 1).padStart(2, '0'),
        yyyy = today.getFullYear();

    dataAdesao.value = `${yyyy}-${mm}-${dd}`;
}