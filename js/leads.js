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

      if(!Array.isArray(json.leads)){
        listaLeads.innerHTML = 'Nenhum lead para exibir.'
        return;
      }


      json.leads.forEach(lead => {
        const
          itemLista = document.createElement('div'),
          linhaStatus = document.createElement('div'),
          linhaNome = document.createElement('div'),
          linhaTelefone = document.createElement('div'),
          linhaEmail = document.createElement('div'),
          linhaCidade = document.createElement('div');

        itemLista.className = 'itemLead';

        // Cria uma linha com o status
        linhaStatus.className = 'linha';
        linhaStatus.innerHTML = `
          <p>Status:</p>
          <p>${lead.STATUS}</p>
        `;


        // Cria uma linha com o nome
        linhaNome.className = 'linha';
        linhaNome.innerHTML = `
          <p>Cliente:</p>
          <p>${lead.NOME}</p>
        `;

        // Cria um linha com o telefone
        linhaTelefone.className = 'linha';
        linhaTelefone.innerHTML = `
          <p>Telefone:</p>
          <p>${lead.TELEFONE}</p>
        `;

        // Cria um linha com o email
        linhaEmail.className = 'linha';
        linhaEmail.innerHTML = `
          <p>E-mail:</p>
          <p>${lead.EMAIL}</p>
        `;

        // Cria um linha com o cidade
        linhaCidade.className = 'linha';
        linhaCidade.innerHTML = `
          <p>Cidade:</p>
          <p>${lead.CIDADE}</p>
        `;


        itemLista.appendChild(linhaStatus);
        itemLista.appendChild(linhaNome);
        itemLista.appendChild(linhaTelefone);
        itemLista.appendChild(linhaEmail);
        itemLista.appendChild(linhaCidade);

        listaLeads.appendChild(itemLista);
      });

    });
}