<?php

function validaCNPJ($cnpj)
{
    $cnpj = preg_replace('/[^0-9]/', '', (string) $cnpj);

    // Valida tamanho
    if (strlen($cnpj) != 14)
        return false;

    // Verifica se todos os digitos são iguais
    if (preg_match('/(\d)\1{13}/', $cnpj))
        return false;

    // Valida primeiro dígito verificador
    for ($i = 0, $j = 5, $soma = 0; $i < 12; $i++) {
        $soma += $cnpj[$i] * $j;
        $j = ($j == 2) ? 9 : $j - 1;
    }

    $resto = $soma % 11;

    if ($cnpj[12] != ($resto < 2 ? 0 : 11 - $resto))
        return false;

    // Valida segundo dígito verificador
    for ($i = 0, $j = 6, $soma = 0; $i < 13; $i++) {
        $soma += $cnpj[$i] * $j;
        $j = ($j == 2) ? 9 : $j - 1;
    }

    $resto = $soma % 11;

    return $cnpj[13] == ($resto < 2 ? 0 : 11 - $resto);
}

function validaCPF($cpf)
{
    // Extrai somente os números
    $cpf = preg_replace('/[^0-9]/is', '', $cpf);

    // Verifica se foi informado todos os digitos corretamente
    if (strlen($cpf) != 11) {
        return false;
    }

    // Verifica se foi informada uma sequência de digitos repetidos. Ex: 111.111.111-11
    if (preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }

    // Faz o calculo para validar o CPF
    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }
    return true;
}

function validateDate($date, $format = 'Y-m-d H:i:s')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}

function formatPhone($phone)
{
    $phone = preg_replace('/[^0-9]/is', '', $phone);

    if (strlen($phone) < 10) {
        return false;
    } else {
        $phone = substr($phone, 0, 11);

        if ($phone[2] === '9' || $phone[2] === '8') { // Se o terceiro caracter começar com 9 ou 8 é número de celular
            $phone = (strlen($phone) === 10) ? substr_replace($phone, '9', 2, 0) : $phone;

            $phone = substr_replace($phone, '(', 0, 0);
            $phone = substr_replace($phone, ')', 3, 0);
            $phone = substr_replace($phone, '-', 9, 0);
            $phone = '  ' . substr($phone, 0, 14);
        } else {
            $phone = substr_replace($phone, '(', 0, 0);
            $phone = substr_replace($phone, ' ', 3, 0);
            $phone = substr_replace($phone, ')', 3, 0);
            $phone = substr_replace($phone, '-', 9, 0);
            $phone = '  ' . substr($phone, 0, 14);
        }
    }

    return $phone;
}

function arrayUppercase($value)
{
    if (is_array($value)) {
        return array_map('arrayUppercase', $value);
    }

    return mb_strtoupper($value, 'UTF-8');
}

/**
 * Insere um registro na tabela desejada
 */
function inserirRegistro(array $campos, $tabela, $mysqli, $resp = array(), $baseCentral = '')
{
    $sqlInsert = "INSERT INTO " . $baseCentral . $tabela . " ( ";

    foreach ($campos as $key => $value) {
        $sqlInsert .= "$key, ";
    }

    $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) VALUES ( ";

    foreach ($campos as $key => $value) {
        $sqlInsert .= "'$value', ";
    }

    $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) ";

    $stmt = $mysqli->prepare($sqlInsert);

    if ($stmt->execute()) {
        $resp['status'] = 'Cadastro realizado';
    } else {
        $resp['status'] = 'Erro';
        $resp['erro'] = "Não foi possível realizar o cadastro";
    }

    return $resp;
}
