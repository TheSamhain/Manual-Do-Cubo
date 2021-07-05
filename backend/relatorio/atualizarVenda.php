<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

require_once '../config.php';
require_once '../jwt.php';
require_once '../utils.php';

$INFOS = $_POST['INFOS'];
$REG = $_POST['VENDA'];
$TOKEN = $_POST['TOKEN'];
$CHAVE = $_POST['LOCAL'];

$arrINFOS = json_decode($INFOS, true);
$arrINFOS = array_map('arrayUppercase', $arrINFOS);
$arrINFOS = array_map('trim', $arrINFOS);

// Valida o token 
$resp = array('autenticado' => JWTvalidate($TOKEN, $SEGREDO));

header('Content-Type: application/json');

if (!JWTvalidate($TOKEN, $SEGREDO)) {
  return print json_encode($resp);
}

// Conecta com a base correta
$arrConection = conectarBD($CHAVE);
$mysqli = $arrConection[0];
$baseCentral = ($arrConection[1] != null && $arrConection[1] != '') ? $arrConection[1] . '.' : '';
$numFilial = $arrConection[2];

if (!$mysqli) {
  $resp = array(
    'autenticado' => false,
    'erro' => 'Local inválido'
  );

  return print(json_encode($resp));
}

$idUser = json_decode(base64_decode($TOKEN))->ID;

$sqlSelectUsuario = "SELECT MDCODI FROM usuarios WHERE REG = ? LIMIT 1";

$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sqlSelectUsuario);
$stmt->bind_param("i", $idUser);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);
} else {
  $resp['status'] = 'Erro';
  $resp['erro'] = 'Erro no cadastro do usuário! Verifique seu cadastro no sistema e tente novamente!';

  return print(json_encode($resp));
}

$MDCODI = $row['MDCODI'];

$sqlUpdate = "UPDATE conscomiss SET COTA = ?, GRUPO = ?, CONTRATO = ? WHERE MD5(CONCAT('VD', REG)) = ? AND VENDMDCODI = ? ";

$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sqlUpdate);
$stmt->bind_param("ssssi", $arrINFOS["COTA"], $arrINFOS["GRUPO"], $arrINFOS["CONTRATO"], $REG, $MDCODI);
$stmt->execute();

if($stmt->affected_rows > 0){
  $resp['alterado'] = true;
} else {
  $resp['alterado'] = false;
  $resp['erro'] = $stmt->error;
}

return print(json_encode($resp));