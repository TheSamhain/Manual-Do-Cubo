<?php

/**
 * Validar JWT
 */
function JWTvalidate($token = '', $secret = '')
{
    $resp = false;

    if (   ($token == '')
        || ($token == null)
        || ($token == 'null')
        || ($secret == '')
        || ($secret == null)
        || ($secret == 'null')
    ) {
        return $resp;
    }

    $arr = base64_decode($token);
    $arr = json_decode($arr);
    $concat = '';

    if($arr == null){
        return false;
    }

    foreach ($arr as $key => $value) {
        if ($key != 'hash') {
            $concat = $concat . $value;
        }
    }

    $hash = hash_hmac($arr->algo, $concat, $secret);

    if ($hash == $arr->hash) {
        $resp = true;
    }


    return $resp;
}

/**
 * Criar token JWT
 */
function JWTcreate($arr = array(), $secret = '')
{

    if ((count($arr) <= 0) || ($secret == '')) {
        return false;
    }

    $TOKEN = array();
    $hash = '';
    $algo = 'md5';

    foreach ($arr as $key => $value) {
        if($value == null || $value == '' || $value == 'null'){
            return false;
        }

        $TOKEN[$key] = $value;
        $hash = $hash . $value;
    }

    $TOKEN['CREATED'] = time();
    $TOKEN['algo'] = $algo;
    $TOKEN['hash'] = hash_hmac($algo, $hash . time() . $algo, $secret);

    return base64_encode(json_encode($TOKEN));
}
