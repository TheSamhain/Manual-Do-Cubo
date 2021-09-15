<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

header('Content-Type: application/json');

// CNX mobiles
$cnxServidor = "exp_inf_mysql.infoel.info";
$cnxUsuario_bd = "cnxmobiles";
$cnxSenha_bd = "movinfoel7913";
$cnxBasedados = "cnx_mobiles";
$cnxPorta = 3309;
$cnxMysqli = mysqli_connect($cnxServidor, $cnxUsuario_bd, $cnxSenha_bd, $cnxBasedados, $cnxPorta);

if (!$cnxMysqli) {
    $resp = array(
        'erro' => 'Não foi possível encontrar a lista de Locais'
    );
    
    return print(json_encode($resp));
}


$sql = 'SELECT * FROM parametros WHERE APP = "ONE_WEB"';

$cnxMysqli->set_charset("utf8");
$stmt = $cnxMysqli->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {
    $resp = array();
    $lista = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $EMPRESA = str_replace("ONE Consórcio - ", "", $row['EMPRESA']);
        $LOCAL =  explode(".", $row['CHAVE']);
        $LOCAL = $LOCAL[0];

        $lista[] = array(
            'EMPRESA' => $EMPRESA,
            'LOCAL' => $LOCAL
        );
    }


    $resp['lista'] = $lista;

    return print(json_encode($resp));
} else {
    $resp = array(
        'erro' => 'Não foi possível encontrar a lista de Locais'
    );

    return print(json_encode($resp));
}
