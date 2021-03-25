const carregarLeads = () => {
  let listaLeads = document.getElementById('listaLeads');

  listaLeads.innerHTML = '<div id="grafico" ></div>';

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login'));
  formData.append('LOCAL', LOCAL);

  fetch('backend/pesquisarLeads.php', {
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

      // ** GRÁFICOS **
      // Opões gerais dos gráficos
      let options = {
        sliceVisibilityThreshold: 0, // Porcentagem para agupar items em um só chamado de 'Outros',
        chartArea: {
          width: "100%",
          height: "100%"
        },
      };



      // Desenha os gráficos de pesagem por empresa
      google.charts.load('current', { packages: ['corechart'], 'language': 'pt' });

      google.charts.setOnLoadCallback(graficoLeads);


      function graficoLeads() {
        let filterLeads = new Set();
        let data = [];

        json.leads.forEach(lead => filterLeads.add(lead.STATUS));


        filterLeads.forEach(leadStatus => {
          let count = json.leads.reduce((accumulator, lead) => (lead.STATUS == leadStatus ? accumulator + 1 : accumulator), 0);
          data.push([`${leadStatus} = ${count}`, count, `${leadStatus} \n ${count} (${(count / json.leads.length * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%)`]);
        });

        // Instantiate and draw our chart, passing in some options.

        dataGraf = new google.visualization.DataTable();
        dataGraf.addColumn('string', 'Status');
        dataGraf.addColumn('number', 'Quantidade');
        dataGraf.addColumn({ type: 'string', role: 'tooltip' });
        dataGraf.addRows(data);

        let divGraf = document.getElementById('grafico');
        let chart = new google.visualization.PieChart(divGraf);
        chart.draw(dataGraf, options);
      }

      // Incluir items na lista
      leads.forEach(lead => listaLeads.appendChild(criarItemLista(lead)));

    });
}

const exibirBtnSalvar = (input) => {
  if (input.value == '')
    return;

  const divItem = input.parentElement;

  btnSalvar = document.createElement('button');
  btnSalvar.innerHTML = 'Salvar';
  btnSalvar.addEventListener('click', () => salvarStatus(divItem));

  if (divItem.getElementsByTagName('button').length === 0) {
    divItem.appendChild(btnSalvar);
  }
}

const salvarStatus = (div) => {
  const
    select = div.getElementsByTagName('select')[0],
    input = div.getElementsByTagName('input')[0],
    valor = select.value,
    codigo = select.getAttribute('data-status');

  const infos = {
    status: valor,
    codigo,
    obs: input.value
  }

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login'));
  formData.append('LOCAL', LOCAL);
  formData.append('INFOS', JSON.stringify(infos));

  fetch('backend/atualizarLead.php', {
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
      leadData.append('TOKEN', localStorage.getItem('login'));
      leadData.append('LOCAL', LOCAL);
      leadData.append('ID', idLead);

      fetch('backend/procurarUmLead.php', {
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
            alert(`Um erro ocorreu ao exibir lead aualizado. Atualize a lista`);
            return false;
          }

          div.innerHTML = criarItemLista(json.lead, false).innerHTML;
          
          if(json.lead.STATUS != 'DISTRIBUÍDO'){            
            div.classList.remove('destacado');
          } 
        });

    });
}

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
    <p>Registro:</p><p>${lead.CODIGO}</p>
    <p>Status:</p>
    <select onchange="exibirBtnSalvar(this)" data-status="${lead.CODIGO}" >
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

    if ( (info != "OBS") && (Typewrite) ) {
      var twStatus = new Typewriter(value, { delay: 0, cursor: null });
      twStatus.typeString(lead[info]).start();
    }
  }

  let inputObs = document.createElement('input');
  inputObs.type = "text";
  inputObs.name = "obs";
  inputObs.placeholder = "Adicionar observação";
  inputObs.addEventListener('input', (e) => exibirBtnSalvar(e.target));

  itemLista.appendChild(inputObs);

  return itemLista;
}