const pesquisar = (text) => {
  console.log(text);
}

const validarEntrada = (event) => {
  if (event.key == 'Enter') {
    pesquisar(event.target.value);
  }
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

      listas.innerHTML = '';

      console.log(json);

      
      json.vendas.forEach(async dadosVenda => {
        let html = await fetch('template/itemLista.html');
        html = await html.text();

        let item = document.createElement('div');
        item.innerHTML = html;

        item.getElementsByClassName('CPF')[0].innerHTML = dadosVenda.CLICPF,
        item.getElementsByClassName('nome')[0].innerHTML = dadosVenda.CLINOME;
        
        
        if(Array.isArray(dadosVenda.PARCELAS)){
          let parcelas = item.getElementsByTagName('tbody')[0];

          dadosVenda.PARCELAS.forEach(parcela => {
            parcelas.innerHTML += `
              <tr>
                <td>${parcela.FATURA}</td>
                <td>${formatDate(parcela.DTVENCIMENTO)}</td>
                <td>${formataMoeda(parcela.VALOR)}</td>
                <td>${parcela.DTPAGAMENTO ? formatDate(parcela.DTPAGAMENTO) : ''}</td>
              </tr>
            `;
          });
        }

        listas.innerHTML += item.innerHTML;
      });

    });

}