<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
    
    require_once 'config.php';
    require_once 'jwt.php';
    
    $INFOS = $_POST['INFOS'];
    $TOKEN = $_POST['TOKEN'];
    $CHAVE = $_POST['LOCAL'];
 
    $arrINFOS = json_decode($INFOS, true);
    // Valida o token 
    $resp = array('autenticado' => JWTvalidate($TOKEN, $SEGREDO));
    
    header('Content-Type: application/json');
    
    if (!JWTvalidate($TOKEN, $SEGREDO)){
        return print json_encode($resp);
    }
    
    // Conecta com a base correta
    $mysqli = conectarBD($CHAVE);

    if(!$mysqli){
        $resp = array(
            'autenticado' => false,
            'erro' => 'Local inválido'
        );
    
        return print(json_encode($resp));
    }

    $bdArray = array(
        'MDCPF' => $arrINFOS->cpf,
        'MDFIRM' => $arrINFOS->nome,
        'NASCIMENTO' => $arrINFOS->dataNasc,
        'MDCEP' => $arrINFOS->cep,
        'MDEND' => $arrINFOS->rua,
        'MDNUM' => $arrINFOS->numeroCasa,
        'MDBAIRRO' => $arrINFOS->bairro,
        'MDCIDA' => $arrINFOS->cidade,
        'MDEST' => $arrINFOS->estado,
    );

    $resp['infos'] = $bdArray;





    print(json_encode($resp));
    
    ?>