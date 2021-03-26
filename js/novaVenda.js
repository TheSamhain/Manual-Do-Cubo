const cadastrarVenda = (e) => {
   e.preventDefault();

   if (!dono) {
      alert('Este cadastro já existe em outra loja, mas não está compartilhado.');
      return;
   }

   const inputValor = document.getElementsByName('valorCarta')[0];
   let valido = true;

   let { target } = e,
      dados = new FormData(target),
      infos = {};

   if (!!dados.get('nome') || !!dados.get('razao')) {
      if (!cadastrarCliente(e)) {
         alert(`Um erro ocorreu ao tentar relizar o cadastro do cliente.`);
         return false;
      }

      let divInfos = target.getElementsByTagName('div')[0];
      divInfos.innerHTML = '';
   }

   if (inputValor.value == '' || justNumbers(inputValor.value) == 0) {
      inputValor.style.boxShadow = "1px 1px 3px red";
      valido = false;
   }


   if (!valido) {
      alert('É necessário preencher todos os campos corretamente.');
      return false;
   }

   let dadosVenda = new FormData(target);

   // Pega os dados da venda no formulário
   for (let pair of dadosVenda.entries()) {
      if ((pair[1].length == 0) && (document.getElementsByName(pair[0])[0].required)) {
         document.getElementsByName(pair[0])[0].style.boxShadow = "1px 1px 3px red";
         alert('É necessário preencher todos os campos corretamente.')
         return false;
      }

      document.getElementsByName(pair[0])[0].style.boxShadow = null;
      infos[pair[0]] = pair[1].trim();
   }

   let formData = new FormData();
   formData.append('INFOS', JSON.stringify(infos));
   formData.append('TOKEN', localStorage.getItem('login.' + param));
   formData.append('LOCAL', LOCAL);

   fetch('backend/cadastrarVenda.php', {
      method: 'POST',
      body: formData,
   })
      .then(resp => resp.json())
      .then(async json => {
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
         telaNovaVenda();

      })

   return true;
}

const carregarDadosCliente = (cpfcnpj) => {
   const
      infoCliente = document.getElementById('infoCliente'),
      inputValor = document.getElementsByName('valorCarta')[0];

   procurarCadastro(cpfcnpj).then(async (dados) => {
      if (dados === false) {
         return;
      }

      if (typeof dados === 'undefined') {
         let html = await fetch('template/novoCliente.html');
         html = await html.text();

         let inputs = document.createElement('div');
         inputs.innerHTML = html;

         inputs.getElementsByTagName('label')[0].remove();
         inputs.getElementsByTagName('label')[0].remove();

         if (cpfcnpj.length == 18) {
            const dadosPessoa = inputs.getElementsByTagName('div')[1];

            inputRazao = `
               <label>
                  <p>Razão social</p>
                  <input type="text" name="razao" required maxlength="60" />
               </label>        
            `,
               inputFantasia = `
               <label>
                  <p>Nome fantasia</p>
                  <input type="text" name="fantasia" maxlength="60" />
               </label>         
            `;

            dadosPessoa.innerHTML = inputRazao + inputFantasia;
         }

         infoCliente.innerHTML = inputs.getElementsByTagName('form')[0].innerHTML;

         if (cpfcnpj.length == 18) {
            document.getElementsByName('razao')[0].focus();
         } else {
            document.getElementsByName('nome')[0].focus();
         }
      } else {
         if ((!dados.DONO) && (!dados.COMPARTILHADO)) {
            infoCliente.innerHTML = '';
            alert(`Este cadastro já existe em outra loja, mas não está compartilhado.\n\nSolicite o compartilhamento para a loja: ${dados.DONONOME}`);
            dono = false;
            return;
         }
         dono = true;

         let nome;

         if (cpfcnpj.length == 14) {
            nome = `<label><p>Nome:</p><p>${dados.NOME}</p></label>`;
         }
         else {
            nome = ` <label><p>Razão Social:</p><p>${dados.RAZAO}</p></label>
                     <label><p>Nome Fantasia:</p><p>${dados.FANTASIA}</p></label>`;
         }

         infoCliente.innerHTML = nome;


         // Esconder teclado no celular
         setTimeout(() => {
            inputValor.focus();
            setTimeout(() => {
               inputValor.blur();
            }, 50);
         }, 50);
      }
   });

}

const alterarTipoPessoaVenda = (tipo) => {
   const cpfcnpj = document.getElementsByTagName('label')[1];
   const infoCliente = document.getElementById('infoCliente');

   infoCliente.innerHTML = '';

   if (tipo == 'J') {
      cpfcnpj.innerHTML = `
         <p>CNPJ</p>
            <input
                required
                type="text"
                name="cnpj"
                oninput="this.value = cnpjMask(this.value)"
                onblur="carregarDadosCliente(this.value)"
                inputmode="numeric"
            />
      `;
   } else {
      cpfcnpj.innerHTML = `
         <p>CPF</p>
            <input
                required
                type="text"
                name="cpf"
                oninput="this.value = cpfMask(this.value)"
                onblur="carregarDadosCliente(this.value)"
                inputmode="numeric"
            />
            `;
   }
}
