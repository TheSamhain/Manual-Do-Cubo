const cadastrarVenda = (e) => {
   e.preventDefault();

   //cadastrarCliente(e);
   console.log(e.target);
}

const carregarDadosCliente = (cpfcnpj) => {
   const infoCliente = document.getElementById('infoCliente');

   procurarCadastro(cpfcnpj).then(async (dados) => {
      if (dados === false) {
         return;
      }

      if (typeof dados === 'undefined') {
         let html = await fetch('template/novoCliente.html');
         html = await html.text();

         let inputs = document.createElement('div');
         inputs.innerHTML = html;

         inputs.getElementsByTagName('button')[0].remove();
         inputs.getElementsByTagName('label')[0].remove();
         inputs.getElementsByTagName('label')[0].remove();

         if (cpfcnpj.length == 18) {
            const dadosPessoa = inputs.getElementsByTagName('label')[1];
            inputs.getElementsByTagName('label')[0].remove();

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
      } else {
         let nome;

         if (cpfcnpj.length == 14) {
            nome = `<label><p>Nome:</p><p>${dados.NOME}</p></label>`;
         }
         else {
            nome = ` <label><p>Razão Social:</p><p>${dados.RAZAO}</p></label>
                     <label><p>Nome Fantasia:</p><p>${dados.FANTASIA}</p></label>`;
         }

         infoCliente.innerHTML = nome;
      }
   });

}

const alterarTipoPessoaVenda = (tipo) => {
   const cpfcnpj = document.getElementsByTagName('label')[1];

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