<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

require_once '../config.php';
require_once '../jwt.php';

$ID = $_POST['ID'];
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


$sqlLeads = " SELECT leads.*, filiais.FILIAL AS LOJA 
              FROM " . $baseCentral . "consleads leads 
              LEFT JOIN " . $baseCentral . "filiais 
              ON leads.FILIAL = filiais.NUM 
              WHERE leads.REG = ? ";

$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sqlLeads);
$stmt->bind_param("i", $ID);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);

  $lead = array(
    'CODIGO' => $row['REG'],
    'STATUS' => $row['STATUS'],
    'NOME' => $row['MDFIRM'],
    'TELEFONE' => $row['FONE'],
    'EMAIL' => $row['EMAIL'],
    'CIDADE' => $row['CIDADE'],
    'CPF' => $row['CPFCNPJ'],
    'LOJA' => $row['LOJA'],
    'OBS' => str_replace("\n" , "<br/>", $row['OBS'])
  );
  
  $resp['lead'] = $lead;
}


return  print(json_encode($resp));