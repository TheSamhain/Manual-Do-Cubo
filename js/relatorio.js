const pesquisar = (text) => {
  text = text.trim();

  const input = document.getElementById('inputPesquisa');

  // Esconder teclado no celular
  setTimeout(() => {
    input.focus();
    setTimeout(() => {
      input.blur();
    }, 50);
  }, 50);

  // Limpar pesquisa se não houver nada digitado
  if (text == '') {
    limparPesquisa();
    return;
  }

  input.value = '';

  const
    items = document.getElementsByClassName('itemLista'),
    resumo = document.getElementById('resumo');

  let qtde = 0;

  for (const item of items) {
    let esconder = true;

    for (let data of item.children) {

      // Procura nas informações se há algo com a pesquisa
      if (data.tagName == 'DIV') {
        const regex = new RegExp(`${text}${justNumbers(text) == '' ? '' : ('|' + justNumbers(text))}`, 'ig');
        let cont = data.children[1].innerHTML;

        if ((cont.search(regex) != -1) || (justNumbers(cont).search(regex) != -1)) {
          esconder = false;
        }
      }

      let venc = (text.search(/venci/ig) >= 0) || (text.search(/atrasa/ig) >= 0);
      // Se for pesqusiado por  vencido ou atrasado procura na tabela se há algum registro vencido e não pago
      if ((data.tagName == 'TABLE') && venc) {
        const
          tbody = data.querySelector('tbody'),
          trs = tbody.children;

        for (const tr of trs) {
          if (tr.style.color == 'red') {
            esconder = false;
            break;
          }
        }

      }

      if (!esconder) {
        break;
      }
    }

    if (esconder) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
      qtde++;
    }

  }

  resumo.innerHTML = `<p>Filtro: <b>${text}</b></p>
                      <p>Registros: <b>${qtde}</b></p>`

}

const limparPesquisa = () => {
  const
    items = document.getElementsByClassName('itemLista'),
    resumo = document.getElementById('resumo');

  for (const item of items) {
    item.style.display = "flex";
  }

  resumo.innerHTML = '';

}

const validarEntrada = (event) => {
  const
    input = event.target,
    valor = input.value;

  if (event.key == "Enter") {
    pesquisar(valor);
  }
}

const carregarTudo = () => {
  let listas = document.getElementById('listas');

  listas.innerHTML = '';

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);

  fetch('backend/relatorio/pesquisarVendas.php', {
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

      if (!Array.isArray(json.vendas)) {
        listas.innerHTML = 'Nenhuma venda concretizada ainda.'
        return;
      }


      json.vendas.forEach(venda => {
        const
          itemLista = document.createElement('div'),
          headerItem = document.createElement('div'),
          divSuperior = document.createElement('div');

        itemLista.className = 'itemLista';
        itemLista.dataset.venda = venda.CODIGO;

        headerItem.className = 'itemRelatorio';
        divSuperior.className = 'itemDivSuperior';

        for (let info in venda.INFOS) {
          if ((!venda.INFOS[info])) {
            continue;
          }

          const label = document.createElement('p');
          const value = document.createElement('p');

          label.innerHTML = `${capitalizeFirstLetter(info)}:`;
          value.innerHTML = `${venda.INFOS[info]}`;

          headerItem.appendChild(label);
          headerItem.appendChild(value);

        }

        divSuperior.appendChild(headerItem);

        if (!venda.VINCULO > 0) {
          divSuperior.innerHTML += `<button onclick="editarVenda(this)">Editar</button>`
        }

        itemLista.appendChild(divSuperior);

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

            let dataHoje = new Date(),
              dataVenc = new Date(parcela.DTVENCIMENTO);

            if (!parcela.DTPAGAMENTO && (dataVenc < dataHoje)) {
              tr.style.color = 'red';
            }

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

/**
 * Edita informações de Grupo, Cota ou Contrato de uma venda
 * @param {HTMLElement} btn 
 */
const editarVenda = (btn) => {
  const
    venda = btn.parentElement.parentElement,
    infosVenda = venda.firstChild.firstChild,
    infosValues = infosVenda.childNodes;

  let infosDeletar = [];

  let infos = {}

  for (let i = 0; i < infosValues.length; i++) {
    let valor = infosValues[i].innerHTML.toUpperCase();

    if (valor.includes("GRUPO")) {
      infos.GRUPO = infosValues[i + 1].innerHTML;
      infosDeletar.push(infosValues[i], infosValues[i + 1]);
      i++;
      continue;
    }

    if (valor.includes("COTA")) {
      infos.COTA = infosValues[i + 1].innerHTML;
      infosDeletar.push(infosValues[i], infosValues[i + 1]);
      i++;
      continue;
    }

    if (valor.includes("CONTRATO")) {
      infos.CONTRATO = infosValues[i + 1].innerHTML;
      infosDeletar.push(infosValues[i], infosValues[i + 1]);
      i++;
      continue;
    }
  }

  infosDeletar.forEach(deletar => deletar.remove());

  infosVenda.innerHTML += `      
    <span class="editavel">Grupo: </span>
    <input class="editavel" name="vendaGrupo" value="${infos.GRUPO || ''}" />
    
    <span class="editavel">Cota: </span>
    <input class="editavel" name="vendaCota" value="${infos.COTA || ''}" />

    <span class="editavel">Contrato: </span>
    <input class="editavel" name="vendaContrato" value="${infos.CONTRATO || ''}" />
    `;

  btn.innerHTML = 'Salvar';
  btn.onclick = () => salvarVenda(btn);
}


/**
 * Salva informações de Grupo, Cota ou Contrato de uma venda
 * @param {HTMLElement} btn 
 */
const salvarVenda = (btn) => {
  const
    venda = btn.parentElement.parentElement,
    infosVenda = venda.firstChild.firstChild,
    editaveis = document.getElementsByClassName("editavel");

  const infos = {}

  for (let input of editaveis) {
    if (input.name == "vendaGrupo") {
      infos.GRUPO = input.value;
      continue;
    }

    if (input.name == "vendaCota") {
      infos.COTA = input.value;
      continue;
    }

    if (input.name == "vendaContrato") {
      infos.CONTRATO = input.value;
      continue;
    }
  }

  let formData = new FormData();
  formData.append('TOKEN', localStorage.getItem('login.' + param));
  formData.append('LOCAL', LOCAL);
  formData.append('VENDA', venda.dataset.venda);
  formData.append('INFOS', JSON.stringify(infos));

  fetch('backend/relatorio/atualizarVenda.php', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then(json => {
      if (!json.alterado && (json.erro != '')) {
        alert(`Erro ao atualizar venda: \n${json.erro} \n\nTente novamente mais tarde`);
      } else {
        let infosAdd = [];

        for (let i = (editaveis.length - 1); i >= 0; i--) {
          infosAdd.push(`<p>${editaveis[i].innerHTML || editaveis[i].value}</p>`);

          editaveis[i].remove();
        }

        infosAdd.reverse();

        infosAdd.forEach(info => infosVenda.innerHTML += info);

        //btn.innerHTML = 'Editar';
        //btn.onclick = () => editarVenda(btn);
        btn.remove();
      }
    });
}