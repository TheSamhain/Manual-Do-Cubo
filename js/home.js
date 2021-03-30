const carregarHome = async () => {
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/home.html');
    html = await html.text();
    main.innerHTML = html;

    const NOME = JSON.parse(atob(localStorage.getItem('login.' + param))).NOME;
    document.getElementById('nomeUsuario').innerHTML = NOME;

    telaLeads();
    
    if (screen.width > 768) {
        alert('ESTE APLICATIVO É DESTINADO PARA CELULARES \n\nNÃO RECOMENDAMOS O USO EM COMPUTADORES')
    }
}

const telaUsuario = async () => { 

}


const telaLeads = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/leads.html');
    html = await html.text();
    content.innerHTML = html;
    
    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', (e) => e.preventDefault() );

    document.getElementById('titulo').innerHTML = "Leads";

    carregarLeads();
}

const telaNovoCliente = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login.' + param), true);

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
    validaToken(localStorage.getItem('login.' + param), true);

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

const telaRelatorio = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/relatorio.html');
    html = await html.text();
    content.innerHTML = html;

    document.getElementById('titulo').innerHTML = "Relatório";

    carregarTudo();
}

const telaComputador = () => {
    let home = document.getElementById("home");
    home.innerHTML = '';
}