<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
header('Content-Type: application/json');

require_once '../config.php';
require_once '../jwt.php';

$USUARIO = $_POST['USUARIO'];
$SENHA = $_POST['SENHA'];
$CHAVE = $_POST['LOCAL'];
$SENHA = md5($SENHA);


$arrConection = conectarBD($CHAVE);
$mysqli = $arrConection[0];
$baseCentral = ($arrConection[1] != null && $arrConection[1] != '') ? $arrConection[1] . '.' : '';
$numFilial = $arrConection[2];


if (!$mysqli) {
    $resp = array(
        'logado' => false,
        'erro' => 'Local inválido'
    );

    return print(json_encode($resp));
}

$sql = "SELECT REG, NOME, SENHA FROM usuarios WHERE NOME = ? AND SENHA = ? LIMIT 1";

$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ss", $USUARIO, $SENHA);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);

    $arr = array(
        'NOME' => $row['NOME'], 
        'ID' => $row['REG']
    );
    $token = JWTcreate($arr, $SEGREDO);

    $resp = array(
        'logado' => (!!$token),
        'token' => $token
    );

    if (!$token) {
        $resp['erro'] = 'Token inválido';
    }
} else {
    $resp = array(
        'logado' => false,
        'erro' => 'Usuário ou senha inválido'
    );

    return print(json_encode($resp));
}

mysqli_stmt_close($stmt);

print json_encode($resp);

$mysqli->close();
