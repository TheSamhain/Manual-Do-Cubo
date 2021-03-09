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
 * @param  {String} strCPF CPF a ser validado
 * @return {Boolean}       True se for válido, false se não for
 */
const isValidCPF = strCPF => {
    strCPF = strCPF.replace(/\D/g, '');

    var Soma = 0;
    var i = 0;
    var Resto;

    if (strCPF == "00000000000")
        return false;

    for (i = 1; i <= 9; i++) {
        Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(strCPF.substring(9, 10)))
        return false;

    Soma = 0;

    for (i = 1; i <= 10; i++)
        Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))
        Resto = 0;

    if (Resto != parseInt(strCPF.substring(10, 11)))
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