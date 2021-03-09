const cadastrarCliente = (e) => {
    e.preventDefault();

    const
        inputCPF = document.getElementsByName('cpf')[0],
        inputDataNasc = document.getElementsByName('dataNasc')[0],
        inputCep = document.getElementsByName('cep')[0];

    let valido = true;

    let dados = new FormData(e.target);

    let infos = {};

    for (let pair of dados.entries()) {
        if (!pair[1]) {
            alert('É necessário preencher todos os campos corretamente.')
            return;
        }

        infos[pair[0]] = pair[1];
    }

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

    if (infos.cep.length < 9) {
        inputCep.style.boxShadow = "1px 1px 3px red";
        valido = false;
    } else {
        inputCep.style.boxShadow = null;
    }

    if (!valido) {
        alert('É necessário preencher todos os campos corretamente.');
        return;
    }

    let formData = new FormData();
    formData.append('INFOS', infos);
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
   
            
   
   
         })
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