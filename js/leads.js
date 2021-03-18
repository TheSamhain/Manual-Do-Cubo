const carregarLeads = () => {
  let listaLeads = document.getElementById('listaLeads');

  listaLeads.innerHTML = '';

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

      json.leads.forEach(lead => {
        const itemLista = document.createElement('div');

        itemLista.className = 'itemLead';


        itemLista.innerHTML = `
        <div class="linha">
        <p>Status:</p>
        <select onchange="exibirSalvar(this)" data-status="${lead.CODIGO}" >
        <option value="" disabled selected >${capitalizeFirstLetter(lead.STATUS)}</option>
        <option value="CONTATADO" >Contatado</option>
        <option value="PROPOSTA ENVIADA" >Proposta enviada</option>
        <option value="EM NEGOCIAÇÃO" >Em negociação</option>
        <option value="PROPOSTA ACEITA" >Proposta aceita</option>
        <option value="PROPOSTA NEGADA" >Proposta negada</option>
        </select>
        </div>
        `;

        delete lead.STATUS;
        delete lead.CODIGO;

        for (let info in lead) {
          const linha = document.createElement('div');
          linha.className = 'linha';

          linha.innerHTML = `
            <p>${capitalizeFirstLetter(info)}:</p>
            <p>${lead[info]}</p>
          `;

          itemLista.appendChild(linha);

          var twStatus = new Typewriter(linha.children[1], { delay: 0, cursor: null });
          twStatus.typeString(lead[info]).start();
        }

        let divObs = document.createElement('div');
        divObs.className = 'linha';
        divObs.innerHTML = `
        <input 
          oninput="(() => { 
            if(this.value != ''){
              exibirSalvar(this);
            } 
          })()" 
          type="text" 
          name="obs" 
          placeholder="Adicionar observação" />`;

          itemLista.appendChild(divObs);

        listaLeads.appendChild(itemLista);

      });

    });
}

const exibirSalvar = (input) => {
  const divItem = input.parentElement.parentElement;

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

  if (valor == "NOVO" || valor == "DISTRIBUÍDO" || valor == "") {
    alert("Este status não pode ser cadastrado!");
    return;
  }


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
      console.log(json);
      
      if (!json.autenticado) {
        alert(json.erro ? `Erro ao cadastrar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return false;
      }

      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return false;
      }

      alert(`${json.status}!`);
      telaLeads();
    });
}