<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

    require_once 'config.php';
    require_once 'jwt.php';

    $TOKEN = $_POST['TOKEN'];

    $resp = false;

    $resp = JWTvalidate($TOKEN, $SEGREDO);

    header('Content-Type: application/json');
    print json_encode(array('autenticado' => $resp));

?>