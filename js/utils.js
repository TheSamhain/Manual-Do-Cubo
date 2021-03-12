/**
 * Valida o token armazenado
 * @param  {String} token Token codificado para ser validado no backend
 * @param  {Boolean} notificar Se true vai notificar se o usuário está inválido e vai para tela de login se estiver
 * @return {Promise<Response>} "PROMISE" -> Se o token for valido retorna true, se não retorna false
 */
const validaToken = async (token, notificar = false) => {
    let formData = new FormData();
    formData.append('TOKEN', token);

    let json = await fetch('backend/validarToken.php', {
        method: 'POST',
        body: formData,
    })

    json = await json.json();

    if ((!json.autenticado) && (notificar)) {
        alert('Usuário não autenticado');
        carregarLogin();
    }

    return json.autenticado;
}

/**
 * Retorna apenas os números da string
 * @param  {String} text texto a ser substituído
 * @return {Number}      números da string
 */
const justNumbers = text => text.replace(/\D/g, '');

/**
 * Retorna apenas letras minusculas e maiusculas e espaço
 * @param  {String} text texto a ser substituído
 * @return {String}      letras
 */
const justAlpha = text => text.replace(/[^a-zA-Z ]/g, '');

/**
 * Valida email inserido utilizando regex
 * @param  {String} email email a ser verificado
 * @return {Boolean}      True se for email válido, false se não for
 */
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Verifica se a data é valida
 * @param  {String} dateStr Data a ser validada
 * @return {Boolean}        True se for válido, false se não for
 */
const isValidDate = (dateStr) => {
    // Primeiro verifica se o formato está correto
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr))
        return false;

    // Pega os inteiros de dia, mes e ano
    var parts = dateStr.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Verifica se o ano está entre 1.000 e 3.000 e se o mês está entre 1 e 12
    if (year < 1000 || year > 3000 || month <= 0 || month > 12)
        return false;

    // Define os dias limites de cada mês
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ajusta o dia limite do ano bissexto 
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Verifica se o dia está entre os limites do mês
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * Verifica se o CPF é válido
 * @param  {String} cpf CPF a ser validado
 * @return {Boolean}       True se for válido, false se não for
 */
const isValidCPF = cpf => {
    cpf = cpf.replace(/\D/g, '');

    var Soma = 0;
    var i = 0;
    var Resto;

    if (cpf == "00000000000000" ||
        cpf == "11111111111111" ||
        cpf == "22222222222222" ||
        cpf == "33333333333333" ||
        cpf == "44444444444444" ||
        cpf == "55555555555555" ||
        cpf == "66666666666666" ||
        cpf == "77777777777777" ||
        cpf == "88888888888888" ||
        cpf == "99999999999999")
        return false;

    for (i = 1; i <= 9; i++) {
        Soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(cpf.substring(9, 10)))
        return false;

    Soma = 0;

    for (i = 1; i <= 10; i++)
        Soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}

/**
 * Verifica se o CNPJ é válido
 * @param  {String} cnpj CNPJ a ser validado
 * @return {Boolean}       True se for válido, false se não for
 */
function isValidCNPJ(cnpj) {

    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj == '')
        return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;

}

/**
 * Inclui máscara de Data de Nascimento
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const dataNascMask = value => {
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{2})(\d)/, '$1/$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona uma / antes do segundo grupo de numero
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1');
}

const formataMoeda = (valor) => {
    valor = Number(valor);
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

/**
 * Inclui máscara de CPF
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const cpfMask = value => {
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

/**
 * Inclui máscara de CNPJ
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const cnpjMask = value => {
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Inclui máscara de CEP
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const cepMask = value => {
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{5})(\d)/, '$1-$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
        .replace(/(-\d{3})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

/**
 * Inclui máscara de Telefone
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const phoneMask = value => {
    return value
        .replace(/\D/g, '') // Apaga qualquer coisa que não seja números
        .replace(/^(\d{2})(\d)/g, "($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
        .replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
}

/**
 * Formata data do tipo yyyy-mm-dd para dd/mm/yyyy
 * @param  {String} date Data para ser convertida
 * @return {String} Data no formato dd/mm/yyyy
 */
const formatDate = (date) => {
    var datePart = date.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];

    return day + '/' + month + '/' + year;
}

/**
 * Inclui máscara da Moeda
 * @param  {String} value texto a ser formatado
 * @return {String}       Texto já formatado
 */
const currencyMask = value => {
    
    if(value.length < 4)
        value = `000${value}`

    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{14}).+$/, '$1') // Pega os 14 primeiros digitos
        .replace(/(\d+)(\d{2})/, '$1,$2') // Pega os dois últimos digitos e coloca uma virgula antes deles
        .replace(/^(0+)([1-9])/, '$2') // Pega o início contendo 0 na frente e seguido de outros números e exclui os zeros na frente
        .replace(/^(0{2,})(,)/, '0$2') // Pega dois zeros seguidos de uma virugla e transforma em apenas 1 zero
        .replace(/(\d+)(\d{3})/, '$1.$2') // Pega os 3 últimos dígitos precedidos de outros dígitos e coloca um ponto entre eles
        .replace(/(\d+)(\d{3})/, '$1.$2') // Pega os 3 últimos dígitos precedidos de outros dígitos e coloca um ponto entre eles
        .replace(/(\d+)(\d{3})/, '$1.$2') // Pega os 3 últimos dígitos precedidos de outros dígitos e coloca um ponto entre eles
}


/**
 * Formata data do tipo yyyy-mm-dd hh:nn:ss para dd/mm/yyyy hh:nn:ss
 * @param  {String} date Data para ser convertida
 * @return {String} Data no formato dd/mm/yyyy hh:nn:ss
 */
const formatDateTime = (date) => {
    let dateTime = new Date(date),
        datePart = date.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2]

    return day + '/' + month + '/' + year + ' ' + dateTime.toLocaleTimeString();
}

/**
 * Procura o CPF na base de dados
 * @param  {String} inputCPF CPF para procurar
 * @return {Promise<Response>} "PROMISE" -> Se o CPF for inválido retorna _false_.    
 * Se o CPF não existir no cadastro retorna _undefined_.    
 * Se existir no cadastro retorna os dados do cliente.
 */
const procurarCadastro = async (cpfcnpj) => {
    if (cpfcnpj.length == 14) {
        if (!isValidCPF(cpfcnpj)) {
            alert('CPF inválido');
            return false;
        }
    } else if (cpfcnpj.length == 18) {
        if (!isValidCNPJ(cpfcnpj)) {
            alert('CNPJ inválido');
            return false;
        }
    } else {
        return false;
    }

    let formData = new FormData();
    formData.append('CPFCNPJ', cpfcnpj);
    formData.append('TOKEN', localStorage.getItem('login'));
    formData.append('LOCAL', LOCAL);

    let resp = await fetch('backend/procurarCadastro.php', {
        method: 'POST',
        body: formData,
    })

    let json = await resp.json();

    if (!json.autenticado) {
        alert(json.erro ? `Erro ao consultar: ${json.erro}.` : 'Usuário não autenticado');
        carregarLogin();
        return false;
    }

    return json.cliente;
}

/**
 * Evita que o usuário insira apenas espaços em branco nos Inputs.
 * @summary
 * Se o input estiver o __inputmode__ como text ou indefinido não permite colocar espaços apenas no ínicio do campo.
 * 
 * Se o input estiver com o __inputmode__ diferente de text não permite colocar esapços nem no ínicio nem no fim.
 */
const evitarEspacosInputs = () => {
    let inputs = document.getElementsByTagName('input');

    for (let input of inputs) {
        // Verifica se o input já tem uma função OnInput
        if (!input.oninput) {
            // Se não tiver coloca uma apenas para não permitir somente espaços no campo
            if (!!input.attributes.inputmode) {
                if (input.attributes.inputmode.value == 'text')
                    input.addEventListener('input', ({ target }) => target.value = target.value.trimStart());
                else
                    input.addEventListener('input', ({ target }) => target.value = target.value.trim());
            } else
                input.addEventListener('input', ({ target }) => target.value = target.value.trimStart());

        }
    }
}
