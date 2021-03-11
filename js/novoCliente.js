const cadastrarCliente = (e) => {
    e.preventDefault();

    const
        inputCPF = document.getElementsByName('cpf')[0],
        inputCNPJ = document.getElementsByName('cnpj')[0],
        inputDataNasc = document.getElementsByName('dataNasc')[0],
        inputCep = document.getElementsByName('cep')[0],
        inputTel1 = document.getElementsByName('tel1')[0],
        inputTipoPessoa = document.getElementsByName('tipoPessoa')[0];

    let valido = true;
    let dados = new FormData(e.target);
    let infos = {};
    const tipo = inputTipoPessoa.value;

    // Pega os dados do formulário
    for (let pair of dados.entries()) {
        if ((pair[1].length == 0) && (document.getElementsByName(pair[0])[0].required)) {
            alert('É necessário preencher todos os campos corretamente.')
            return;
        }

        infos[pair[0]] = pair[1].trim();
    }

    if (tipo == 'F') {
        if (!isValidCPF(infos.cpf)) {
            inputCPF.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputCPF.style.boxShadow = null;
        }

        if (!isValidDate(formatDate(infos.dataNasc))) {
            inputDataNasc.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputDataNasc.style.boxShadow = null;
        }
    } else {
        if (!isValidCNPJ(infos.cnpj)) {
            inputCNPJ.style.boxShadow = "1px 1px 3px red";
            valido = false;
        } else {
            inputCNPJ.style.boxShadow = null;
        }
    }

    if (infos.cep.length < 9) {
        inputCep.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputCep.style.boxShadow = null;
    }

    if (infos.tel1.length < 14) {
        inputTel1.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputTel1.style.boxShadow = null;
    }

    if (!valido) {
        alert('É necessário preencher todos os campos corretamente.');
        return;
    }

    let formData = new FormData();
    formData.append('INFOS', JSON.stringify(infos));
    formData.append('TOKEN', localStorage.getItem('login'));
    formData.append('LOCAL', LOCAL);

    fetch('backend/cadastrarCliente.php', {
        method: 'POST',
        body: formData,
    })
        .then(resp => resp.json())
        .then(async json => {
            console.log(json);
            if (!json.autenticado) {
                alert(json.erro ? `Erro ao consultar: ${json.erro}.` : 'Usuário não autenticado');
                carregarLogin();
                return;
            }

            if (json.status == 'Erro') {
                alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
                return;
            }

            let btnCadastro = document.getElementById('btnSalvarCadastro');
            if (btnCadastro != null) {
                alert(`${json.status}!`);
                telaNovoCliente();
            }
        })
}

const verificarDados = (cpfcnpj) => {
    let tipo;

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

        if (tipo == 'F') {
            const
                inputDataNasc = document.getElementsByName('dataNasc')[0],
                inputNome = document.getElementsByName('nome')[0];

            inputDataNasc.value = dados.DTNASCIMENTO;
            inputNome.value = dados.NOME;
        } else {
            const inputRazao = document.getElementsByName('razao')[0],
                inputFantasia = document.getElementsByName('fantasia')[0];

            inputRazao.value = dados.RAZAO;
            inputFantasia.value = dados.FANTASIA;
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
                    inputNumCasa.focus();
                } else {
                    inputRua.focus();
                }
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