const cadastrarVenda = (e) => {
   e.preventDefault();
}

const verificarCPF = (inputCPF) => {
   const cpf = justNumbers(inputCPF);

   if (cpf.length <= 0)
      return;

   if (!isValidCPF(cpf)) {
      alert('CPF inválido');
      return;
   }

   let formData = new FormData();
   formData.append('CPF', inputCPF);
   formData.append('TOKEN', localStorage.getItem('login'));
   formData.append('LOCAL', LOCAL);

   fetch('backend/procurarCPF.php', {
      method: 'POST',
      body: formData,
   })
      .then(resp => resp.json())
      .then(async json => {
         
         if (!json.autenticado) {
            alert(json.erro ? `Erro ao consultar: ${json.erro}.` : 'Usuário não autenticado');
            carregarLogin();
            return;
         }

         const infoCliente = document.getElementById('infoCliente');
         
         if(json.cliente){           
            const nome = `<label><p>Nome:</p><p>${json.cliente.NOME}</p></label>`;

            infoCliente.innerHTML = nome;
         } else {
            let html = await fetch('template/novoCliente.html');
            html = await html.text();
            
            let inputs = document.createElement('div');
            inputs.innerHTML = html;

            inputs.getElementsByTagName('button')[0].remove();
            inputs.getElementsByTagName('label')[0].remove();

            infoCliente.innerHTML = inputs.getElementsByTagName('form')[0].innerHTML;
         }


      })
}