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
        if ($key != 'HASH') {
            $concat = $concat . $value;
        }
    }

    $hash = hash_hmac($arr->ALGO, $concat, $secret);

    if ($hash == $arr->HASH) {
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
    $HASH = '';
    $ALGO = 'md5';

    foreach ($arr as $key => $value) {
        if($value == null || $value == '' || $value == 'null'){
            return false;
        }

        $TOKEN[$key] = $value;
        $HASH = $HASH . $value;
    }

    $TOKEN['CREATED'] = time();
    $TOKEN['ALGO'] = $ALGO;
    $TOKEN['HASH'] = hash_hmac($ALGO, $HASH . time() . $ALGO, $secret);

    return base64_encode(json_encode($TOKEN));
}
