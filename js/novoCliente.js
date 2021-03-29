var novoCliente = true;

const cadastrarCliente = (e) => {
    e.preventDefault();
    
    if (!dono) {
        alert('Este cadastro já existe em outra loja, mas não está compartilhado.');
        return;
    }

    const
        inputCPF = document.getElementsByName('cpf')[0],
        inputCNPJ = document.getElementsByName('cnpj')[0],
        inputDataNasc = document.getElementsByName('dataNasc')[0],
        inputCep = document.getElementsByName('cep')[0],
        inputTel1 = document.getElementsByName('tel1')[0],
        inputTel2 = document.getElementsByName('tel2')[0],
        inputTipoPessoa = document.getElementsByName('tipoPessoa')[0],
        inputEmail = document.getElementsByName('email')[0];

    let valido = true;
    let dados = new FormData(e.target);
    let infos = {};
    const tipo = inputTipoPessoa.value;

    // Pega os dados do formulário
    for (let pair of dados.entries()) {
        if ((pair[1].length == 0) && (document.getElementsByName(pair[0])[0].required)) {
            document.getElementsByName(pair[0])[0].style.boxShadow = "1px 1px 3px red";
            alert('É necessário preencher todos os campos corretamente.')
            return false;
        }

        document.getElementsByName(pair[0])[0].style.boxShadow = null;
        infos[pair[0]] = pair[1].trim();
    }    
    

    // Valida os dados da pessoa
    if (tipo == 'F') {
        let dateParts = infos.dataNasc.split('/');
        infos.dataNasc = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`

        //Valida o CPF
        if (!isValidCPF(infos.cpf)) {
            inputCPF.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputCPF.style.boxShadow = null;
        }

        // Valida a data de nascimento
        if (!isValidDate(formatDate(infos.dataNasc))) {
            inputDataNasc.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputDataNasc.style.boxShadow = null;
        }
    } else {
        // Valida o CNPJ
        if (!isValidCNPJ(infos.cnpj)) {
            inputCNPJ.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputCNPJ.style.boxShadow = null;
        }
    }

    // Valida o CEP
    if (infos.cep.length < 9) {
        inputCep.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputCep.style.boxShadow = null;
    }

    //Valida os telefones
    if (infos.tel1.length < 14) {
        inputTel1.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputTel1.style.boxShadow = null;
    }

    if ((infos.tel2.length < 14) && (infos.tel2.length > 0)) {
        inputTel2.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputTel2.style.boxShadow = null;
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
        return false;
    }

    let formData = new FormData();
    formData.append('INFOS', JSON.stringify(infos));
    formData.append('TOKEN', localStorage.getItem('login.' + param));
    formData.append('LOCAL', LOCAL);

    fetch('backend/clientes/cadastrarCliente.php', {
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

            let btnCadastro = document.getElementById('btnSalvarCadastro');
            if (btnCadastro != null) {
                alert(`${json.status}!`);
                telaNovoCliente();
            }
        })

    return true;
}

const verificarDados = (cpfcnpj) => {
    let tipo;
    novoCliente = true;
    incluirSalvar();

    if (cpfcnpj.length == 14) {
        tipo = 'F';
    } else if (cpfcnpj.length == 18) {
        tipo = 'J';
    } else {
        return;
    }

    const
        inputEmail = document.getElementsByName('email')[0],
        inputTel1 = document.getElementsByName('tel1')[0],
        inputTel2 = document.getElementsByName('tel2')[0],

        inputCep = document.getElementsByName('cep')[0],
        inputRua = document.getElementsByName('rua')[0],
        inputNumCasa = document.getElementsByName('numeroCasa')[0],
        inputBairro = document.getElementsByName('bairro')[0],
        inputCidade = document.getElementsByName('cidade')[0],
        inputEstado = document.getElementsByName('estado')[0],
        inputComplemento = document.getElementsByName('complemento')[0];


    procurarCadastro(cpfcnpj).then(dados => {
        if (!dados) {
            return;
        }

        if ((!dados.DONO) && (!dados.COMPARTILHADO)) {
            alert(`Este cadastro já existe em outra loja, mas não está compartilhado.\n\nSolicite o compartilhamento para a loja: ${dados.DONONOME}`);
            dono = false;
            return;
        }
        dono = true;

        if (tipo == 'F') {
            document.getElementsByName('dataNasc')[0].value = formatDate(dados.DTNASCIMENTO);
            document.getElementsByName('nome')[0].value = dados.NOME;

        } else {
            document.getElementsByName('razao')[0].value = dados.RAZAO;
            document.getElementsByName('fantasia')[0].value = dados.FANTASIA;
        }

        inputEmail.value = dados.EMAIL;
        inputTel1.value = dados.TEL1;
        inputTel2.value = dados.TEL2;

        inputCep.value = dados.ENDCEP;
        inputRua.value = dados.ENDLOGRADOURO;
        inputNumCasa.value = dados.ENDNUMERO;
        inputBairro.value = dados.ENDBAIRRO;
        inputCidade.value = dados.ENDMUNICIPIO;
        inputEstado.value = dados.ENDESTADO;
        inputComplemento.value = dados.ENDCOMPLEMENTO;

        incluirSalvar("Salvar");
        novoCliente = false;
    });
}

const verificarCep = (cep) => {
    const inputCep = document.getElementsByName('cep')[0],
        inputRua = document.getElementsByName('rua')[0],
        inputNumCasa = document.getElementsByName('numeroCasa')[0],
        inputBairro = document.getElementsByName('bairro')[0],
        inputCidade = document.getElementsByName('cidade')[0],
        inputEstado = document.getElementsByName('estado')[0];

    cep = justNumbers(cep);

    if (cep == '') {
        return;
    }

    fetch(`http://viacep.com.br/ws/${cep}/json/`)
        .then((resp) => {
            inputCep.style.boxShadow = null;
            resp.json().then(json => {
                if (json.uf) {
                    inputEstado.value = json.uf;
                }

                if (json.localidade) {
                    inputCidade.value = json.localidade;
                }

                if (json.bairro) {
                    inputBairro.value = json.bairro;
                }

                if (json.logradouro) {
                    inputRua.value = json.logradouro;
                }
                focus();
            });
        })
        .catch((e) => {
            alert('CEP inválido.');
            inputCep.style.boxShadow = "1px 1px 3px red";
            focus();
        });

}

const alterarTipoPessoa = (tipo) => {
    const dadosPessoa = document.getElementById('dadosPessoa');

    if (tipo == 'J') {
        const inputCNPJ = `
            <label>
                <p>CNPJ</p>
                <input type="text" name="cnpj" required oninput="this.value = cnpjMask(this.value)" onblur="verificarDados(this.value)" inputmode="numeric" />
            </label>
        `,
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

        dadosPessoa.innerHTML = inputCNPJ + inputRazao + inputFantasia;
    } else {
        const inputCPF = `
            <label>
                <p>CPF</p>
                <input type="text" name="cpf" required oninput="this.value = cpfMask(this.value)" onblur="verificarDados(this.value)" inputmode="numeric" />
            </label>
        `,
            inputNome = `
            <label>
                <p>Nome completo</p>
                <input type="text" name="nome" required maxlength="60" />
            </label>        
        `,
            inputDataNasc = `
            <label>
                <p>Data de Nascimento</p>
                <input type="date" name="dataNasc" required />
            </label>
        `;


        dadosPessoa.innerHTML = inputCPF + inputNome + inputDataNasc;
    }
}

const validarDataNasc = (input) => {
    if (!input.value)
        return;

    if (!isValidDate(input.value)) {
        input.style.boxShadow = "1px 1px 3px red";
        alert('Data de nascimento inválida');
    } else {
        input.style.boxShadow = null;
    }
}