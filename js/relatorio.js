const pesquisar = (text) => {
  text = text.trim();

  let items = document.getElementsByClassName('itemLista');

  for (let item of items) {
    let esconder = true;

    for (let data of item.children) {

      if (data.tagName == 'DIV') {
        const regex = new RegExp(`${text}${justNumbers(text) == '' ? '' : ('|' + justNumbers(text))}`, 'ig');
        let cont = data.children[1].innerHTML;

        if ((cont.search(regex) != -1) || (justNumbers(cont).search(regex) != -1)) {
          esconder = false;
        }
      }

      if (data.tagName == 'TABLE') {

      }

    }

    if (esconder)
      item.style.display = "none";
    else
      item.style.display = "flex";

  }
}

const validarEntrada = (event) => {
  let items = document.getElementsByClassName('itemLista');

  for (let item of items) {
    item.style.display = "flex";
  }

  if (event.target.value.length > 4)
    pesquisar(event.target.value);

}

const carregarTudo = () => {
  let listas = document.getElementById('listas');

  listas.innerHTML = '';

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login'));
  formData.append('LOCAL', LOCAL);

  fetch('backend/pesquisarVendas.php', {
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

      if(!Array.isArray(json.vendas)){
        listas.innerHTML = 'Nenhuma venda concretizada ainda.'
        return;
      }


      json.vendas.forEach(venda => {
        const
          itemLista = document.createElement('div'),
          linhaNome = document.createElement('div'),
          linhaCpf = document.createElement('div');

        itemLista.className = 'itemLista';

        // Cria uma linha com o nome
        linhaNome.className = 'linha';
        linhaNome.innerHTML = `
          <p>Cliente:</p>
          <p>${venda.CLINOME}</p>
        `;

        // Cria um linha com o CPF
        linhaCpf.className = 'linha';
        linhaCpf.innerHTML = `
          <p>CPF:</p>
          <p>${venda.CLICPF}</p>
        `;

        itemLista.appendChild(linhaNome);
        itemLista.appendChild(linhaCpf);

        if (Array.isArray(venda.PARCELAS)) {
          const
            table = document.createElement('table'),
            tbody = document.createElement('tbody');

          table.className = "parcelas";

          table.innerHTML = `
            <thead>
              <tr>
                <th>Parcelas</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Pagamento</th>
              </tr>
            </thead>
          `;

          venda.PARCELAS.forEach(parcela => {
            let tr = document.createElement('tr');

            tr.innerHTML += `
                  <td>${parcela.FATURA}</td>
                  <td>${formatDate(parcela.DTVENCIMENTO)}</td>
                  <td>${formataMoeda(parcela.VALOR)}</td>
                  <td>${parcela.DTPAGAMENTO ? formatDate(parcela.DTPAGAMENTO) : ''}</td>
            `;

            tbody.appendChild(tr);
          });

          table.appendChild(tbody);
          itemLista.appendChild(table);

        } else {
          const p = document.createElement('p');
          p.className = "linha msgAviso";
          p.innerHTML = "Ainda não foi efetuado o lançamento de parcelas para esta venda.";
          itemLista.appendChild(p);
        }

        listas.appendChild(itemLista);

      });

    });

}