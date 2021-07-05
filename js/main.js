const carregarMain = async () => {
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/main.html');
    html = await html.text();
    app.innerHTML = html;

    const NOME = JSON.parse(atob(localStorage.getItem('login.' + param))).NOME;
    document.getElementById('nomeUsuario').innerHTML = NOME;

    fetch('backend/login/procurarLocais.php', {
        method: 'POST'
    })
        .then(resp => resp.json())
        .then(json => {
            let local = json.lista.find(item => item.LOCAL == LOCAL.split('.')[0])

            document.getElementById('cidade').innerHTML = local.EMPRESA;
        });

    /*
    if (screen.width > 768) {
        alert('ESTE APLICATIVO É DESTINADO PARA CELULARES \n\nNÃO RECOMENDAMOS O USO EM COMPUTADORES')
    }
    */

    //telaLeads();
    telaRelatorio();
}

const telaUsuario = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/usuario.html');
    html = await html.text();
    content.innerHTML = html;

    
    document.getElementById('titulo').innerHTML = "Perfil";
}


const telaLeads = async () => {
    const content = document.getElementById('content');
    validaToken(localStorage.getItem('login.' + param), true);

    let html = await fetch('template/leads.html');
    html = await html.text();
    content.innerHTML = html;

    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', (e) => e.preventDefault());

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
    
    document.getElementById("content").scrollTo(0, 0);
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

const sair = () => {
    localStorage.removeItem('login.' + param);
    carregarLogin();
}