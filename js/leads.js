var arrayLeads = [];

/**
 * Carrega a lista de Leads e exibe o gráfico
 */
const carregarLeads = () => {
  let listaLeads = document.getElementById('listaLeads');

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);

  fetch('backend/leads/pesquisarLeads.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {
      if (!json.autenticado) {
        alert(json.erro ? `Erro ao cadastrar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return false;
      }

      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return false;
      }

      if (!Array.isArray(json.leads)) {
        listaLeads.innerHTML = 'Nenhum lead para exibir.'
        return;
      }

      const leads = JSON.parse(JSON.stringify(json.leads));

      arrayLeads = json.leads;
      criarGrafico();

      // Incluir items na lista
      leads.forEach(lead => listaLeads.appendChild(criarItemLista(lead)));

    });
}

/**
 * Cria o gráfico apartir dos dados existentes na variável global **arrayLeads**
 */
const criarGrafico = () => {
  // ** GRÁFICOS **
  // Opões gerais dos gráficos
  let options = {
    sliceVisibilityThreshold: 0, // Porcentagem para agupar items em um só chamado de 'Outros',
    chartArea: {
      width: "100%",
      height: "100%",
    }
  };

  // Desenha os gráficos de pesagem por empresa
  google.charts.load('current', { packages: ['corechart'], 'language': 'pt' });

  google.charts.setOnLoadCallback(graficoLeads);

  /**
   * Cria o gráfico dos status
   */
  function graficoLeads() {
    let filterLeads = new Set();
    let data = [];

    arrayLeads.forEach(lead => filterLeads.add(lead.STATUS));


    filterLeads.forEach(leadStatus => {
      let count = arrayLeads.reduce((accumulator, lead) => (lead.STATUS == leadStatus ? accumulator + 1 : accumulator), 0);
      data.push([`${leadStatus} = ${count}`, count, `${leadStatus} \n ${count} (${(count / arrayLeads.length * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%)`]);
    });

    // Instantiate and draw our chart, passing in some options.

    dataGraf = new google.visualization.DataTable();
    dataGraf.addColumn('string', 'Status');
    dataGraf.addColumn('number', 'Quantidade');
    dataGraf.addColumn({ type: 'string', role: 'tooltip' });
    dataGraf.addRows(data);

    let divGraf = document.getElementById('grafico');

    document.getElementById("titloGrafico").innerHTML = "Resumo dos status";

    let chart = new google.visualization.PieChart(divGraf);
    chart.draw(dataGraf, options);
  }
}

/**
 * Exibe o botão de salvar no item da lista que o chamou
 * @param {HTMLInputElement} input Campo que exibe o botão, pode ser input, select etc
 * @param {Function} onclick Função executada pelo botão salvar
 * @param {String} title Título do botão, por default é "Salvar"
 */
const exibirBtnSalvar = (input, onclick, title = "Salvar") => {
  if (input.value == '') {
    return;
  }

  const divItem = input.parentElement;

  btnSalvar = document.createElement('button');
  btnSalvar.innerHTML = title;
  btnSalvar.addEventListener('click', () => onclick(divItem));

  if (divItem.getElementsByTagName('button').length === 0) {
    divItem.appendChild(btnSalvar);
  }
}

/**
 * Altera o status do lead ou inclui um a nova observação
 * @param {HTMLDivElement} div Div com as informações do lead
 */
const salvarStatus = (div) => {
  const
    select = div.getElementsByTagName('select')[0],
    input = div.getElementsByTagName('input')[0];

  const
    valor = select.value,
    codigo = select.getAttribute('data-status');

  const infos = {
    codigo,
    status: valor,
    obs: input.value
  }

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);
  formData.append('INFOS', JSON.stringify(infos));

  fetch('backend/leads/atualizarLead.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {
      if (!json.autenticado) {
        alert(json.erro ? `Erro ao atualizar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return false;
      }

      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return false;
      }

      const idLead = div.getElementsByTagName('p')[1].innerHTML;

      let leadData = new FormData();
      leadData.append('TOKEN', localStorage.getItem('login.' + param));
      leadData.append('LOCAL', LOCAL);
      leadData.append('ID', idLead);

      fetch('backend/leads/procurarUmLead.php', {
        method: 'POST',
        body: leadData,
      })
        .then(resp => resp.json())
        .then(json => {
          if (!json.autenticado) {
            alert(json.erro ? `Erro ao atualizar lead: ${json.erro}.` : 'Usuário não autenticado');
            carregarLogin();
            return false;
          }

          if (json.status == 'Erro') {
            alert(`Um erro ocorreu ao exibir lead atualizado. Atualize a lista`);
            return false;
          }

          let
            id = -1,
            lead = JSON.parse(JSON.stringify(json.lead));

          arrayLeads.forEach((lead, index) => {
            if (lead.CODIGO == json.lead.CODIGO) {
              id = index;
            }
          });

          if (id >= 0) {
            arrayLeads[id] = json.lead;
            criarGrafico();
          }

          div.innerHTML = criarItemLista(lead, false).innerHTML;

          if (lead.STATUS != 'DISTRIBUÍDO') {
            div.classList.remove('destacado');
          }
        });

    });
}

/**
 * Cria um item da lista com as informções do lead
 * @param {JSON} lead Informações do lead, nome, cpf, email, cidade, telefone, loja
 * @param {Boolean} Typewrite Define se vai ser executado a animação de digitação para as informações
 * @returns {HTMLDivElement} Retorna uma div com as informações do lead
 */
const criarItemLista = (lead, Typewrite = true) => {
  if (lead.STATUS == 'NOVO') {
    return;
  }

  const itemLista = document.createElement('div');

  itemLista.className = 'itemLead';

  if (lead.STATUS == 'DISTRIBUÍDO') {
    itemLista.classList.add('destacado');
  }


  itemLista.innerHTML = `
    <p class="registro">Registro:</p><p>${lead.CODIGO}</p>
    <p>Status:</p>
    <select onchange="exibirBtnSalvar(this, salvarStatus)" data-status="${lead.CODIGO}" >
      <option value="${lead.STATUS}" disabled selected >${capitalizeFirstLetter(lead.STATUS)}</option>
      <option value="CONTATADO" >Contatado</option>
      <option value="PROPOSTA ENVIADA" >Proposta enviada</option>
      <option value="EM NEGOCIAÇÃO" >Em negociação</option>
      <option value="PROPOSTA ACEITA" >Proposta aceita</option>
      <option value="PROPOSTA NEGADA" >Proposta negada</option>
    </select>
  `;

  delete lead.STATUS;
  delete lead.CODIGO;

  for (let info in lead) {
    if (!lead[info]) {
      continue;
    }

    const label = document.createElement('p');
    const value = document.createElement('p');

    label.innerHTML = `${capitalizeFirstLetter(info)}:`;
    value.innerHTML = `${lead[info]}`;

    itemLista.appendChild(label);
    itemLista.appendChild(value);

    if ((info != "OBS") && (Typewrite)) {
      var twStatus = new Typewriter(value, { delay: 0, cursor: null });
      twStatus.typeString(lead[info]).start();
    }
  }

  let inputObs = document.createElement('input');
  inputObs.type = "text";
  inputObs.name = "obs";
  inputObs.placeholder = "Adicionar observação";
  inputObs.addEventListener('input', (e) => exibirBtnSalvar(e.target, salvarStatus));

  itemLista.appendChild(inputObs);

  return itemLista;
}

/**
 * Exibe ou esconde os campos para cadastrar um novo lead
 */
const incluirLeadDiv = () => {
  const novoLead = document.getElementById("novoLead");

  if (!(novoLead.style.display) || (novoLead.style.display == "none")) {
    novoLead.style.display = 'grid';
  } else {
    novoLead.style.display = 'none';
  }
}

/**
 * Cadastra um novo lead no sistema
 * @param {HTMLDivElement} div 
 */
const cadastrarNovoLead = (div) => {
  const
    inputs = div.getElementsByTagName('input'),
    inputCPF = document.getElementsByName('cpf')[0],
    inputTelefone = document.getElementsByName('telefone')[0],
    inputEmail = document.getElementsByName('email')[0];

  let
    valido = true,
    infos = {};

  for (input of inputs) {
    if ((input.required) && (input.value.length == 0)) {
      input.style.boxShadow = "1px 1px 3px red"
      alert(`O ${input.name} precisa ser informado.`);
      return;
    }

    infos[input.name] = input.value.trim();
  }

  infos.status = div.getElementsByTagName('select')[0].value;

  // Valida o CPF
  if (!isValidCPF(infos.cpf) && (infos.cpf.length > 0)) {
    inputCPF.style.boxShadow = "1px 1px 3px red";
    valido = false;
  } else {
    inputCPF.style.boxShadow = null;
  }

  // Valida o telefone
  if ((infos.telefone.length < 14) && (infos.telefone.length > 0)) {
    inputTelefone.style.boxShadow = "1px 1px 3px red";
    valido = false;
  } else {
    inputTelefone.style.boxShadow = null;
  }

  // Valida o email
  if (!isValidEmail(infos.email) && (infos.email.length > 0)) {
    inputEmail.style.boxShadow = "1px 1px 3px red";
    valido = false;
  } else {
    inputEmail.style.boxShadow = null;
  }

  if (!valido) {
    alert('É necessário preencher todos os campos corretamente.');
    return;
  }

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);
  formData.append('INFOS', JSON.stringify(infos));

  fetch('backend/leads/cadastrarLead.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {

      if (!json.autenticado) {
        alert(json.erro ? `Erro ao cadastrar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return;
      }

      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return;
      }

      div.getElementsByTagName('button')[0].remove();

      for (input of inputs) {
        input.value = '';
      }

      div.getElementsByTagName('select')[0].value = "DISTRIBUÍDO";

      let leadData = new FormData();
      leadData.append('TOKEN', localStorage.getItem('login.' + param));
      leadData.append('LOCAL', LOCAL);
      leadData.append('ID', json.id);

      fetch('backend/leads/procurarUmLead.php', {
        method: 'POST',
        body: leadData,
      })
        .then(resp => resp.json())
        .then(json => {
          if (!json.autenticado) {
            alert(json.erro ? `Erro ao atualizar lead: ${json.erro}.` : 'Usuário não autenticado');
            carregarLogin();
            return false;
          }

          if (json.status == 'Erro') {
            alert(`Um erro ocorreu ao exibir lead atualizado. Atualize a lista`);
            return false;
          }

          let lead = JSON.parse(JSON.stringify(json.lead));

          arrayLeads.push(json.lead);
          criarGrafico();

          let listaLeads = document.getElementById('listaLeads');

          listaLeads.appendChild(criarItemLista(lead, false))
        });


      incluirLeadDiv();
    });

}

const procurarLead = (input) => {
  const
    valor = input.value,
    inputNome = document.getElementsByName('nome')[0],
    inputTelefone = document.getElementsByName('telefone')[0],
    inputEmail = document.getElementsByName('email')[0],
    inputCidade = document.getElementsByName('cidade')[0];

  procurarCadastro(valor)
    .then(json => {

      if (!!json) {
        exibirBtnSalvar(input, cadastrarNovoLead, 'Incluir')

        inputEmail.value = json.EMAIL;
        inputTelefone.value = json.TEL1.trim();
        inputNome.value = json.NOME;
        inputCidade.value = json.ENDMUNICIPIO;
      }
    });
}