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

function validatePhone($phone)
{
    $phone = preg_replace('/[^0-9]/is', '', $phone);

    if (strlen($phone) < 8) {
        return false;
    } else {
        $phone = substr($phone, 0, 11);

        if ($phone[2] === '9' || $phone[2] === '8') { // Se o terceiro caracter começar com 9 ou 8 é número de celular
            $phone = (strlen($phone) === 10) ? substr_replace($phone, '9', 2, 0) : $phone;

            $phone = substr_replace($phone, '(', 0, 0);
            $phone = substr_replace($phone, ')', 3, 0);
            $phone = substr_replace($phone, '-', 9, 0);
            $phone = substr($phone, 0, 14);
        } else {
            $phone = substr_replace($phone, '(', 0, 0);
            $phone = substr_replace($phone, ' ', 3, 0);
            $phone = substr_replace($phone, ')', 3, 0);
            $phone = substr_replace($phone, '-', 9, 0);
            $phone = substr($phone, 0, 14);
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
