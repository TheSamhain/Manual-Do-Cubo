<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

require_once 'config.php';
require_once 'jwt.php';

$CPFCNPJ = $_POST['CPFCNPJ'];
$TOKEN = $_POST['TOKEN'];
$CHAVE = $_POST['LOCAL'];

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

$sqlLeads = "SELECT * FROM " . $baseCentral . "consleads WHERE VENDCOD = ? ";

$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sqlLeads);
$stmt->bind_param("i", $MDCODI);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {
  $leads = array();

  while ($row = mysqli_fetch_assoc($result)) {
    $leads[] = array(
      'STATUS' => $row['STATUS'],
      'NOME' => $row['MDFIRM'],
      'TELEFONE' => $row['FONE'],
      'EMAIL' => $row['EMAIL'],
      'CIDADE' => $row['CIDADE'],
      'CODIGO' => $row['REG'],
    );
  }

  $resp['leads'] = $leads;
}



return  print(json_encode($resp));
