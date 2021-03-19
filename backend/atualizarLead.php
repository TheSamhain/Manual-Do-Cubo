<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

require_once "config.php";
require_once "jwt.php";
require_once "utils.php";

$INFOS = $_POST["INFOS"];
$TOKEN = $_POST["TOKEN"];
$CHAVE = $_POST["LOCAL"];

$arrINFOS = json_decode($INFOS, true);
$arrINFOS = array_map("arrayUppercase", $arrINFOS);
$arrINFOS = array_map("trim", $arrINFOS);
// Valida o token 
$resp = array("autenticado" => JWTvalidate($TOKEN, $SEGREDO));

header("Content-Type: application/json");

if (!JWTvalidate($TOKEN, $SEGREDO)) {
  return print json_encode($resp);
}

// Conecta com a base correta
$arrConection = conectarBD($CHAVE);
$mysqli = $arrConection[0];
$baseCentral = ($arrConection[1] != null && $arrConection[1] != '') ? $arrConection[1] . '.' : "";
$numFilial = $arrConection[2];

if (!$mysqli) {
  $resp = array(
    "autenticado" => false,
    "erro" => "Local inválido. \nÉ necessário fazer o Login novamente!"
  );

  return print(json_encode($resp));
}

$nomeUser = json_decode(base64_decode($TOKEN))->NOME;
$idUser = json_decode(base64_decode($TOKEN))->ID;

// Procura no cadastro o usuário
$sqlSelectUsuario = "SELECT * FROM " . $baseCentral . "maladir WHERE MDCODI = (SELECT MDCODI FROM usuarios WHERE REG = ? ) LIMIT 1";

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

// Armazena o código no cadatro deste usuário
$MDCODI = $row['MDCODI'];

$bdArray = array(
  'STATUS' => $arrINFOS['status'],
  'STATUSUSER' => mb_strtoupper($nomeUser, 'UTF-8'),
  'STATUSDH' => date("Y-m-d H:i:s"),
);

$sqlUpdate = "UPDATE " . $baseCentral . "consleads SET ";


// Se o STATUS for diferetne de NOVO ou DISTRIBUÍDO atualizar o STATUS
if ($arrINFOS["status"] != "NOVO" && $arrINFOS["status"] != "DISTRIBUÍDO" && $arrINFOS["status"] != "") {
  foreach ($bdArray as $key => $value) {
    $sqlUpdate .= "$key = '$value', ";
  }
}

// Se houver observação para incluir coloca no update
if ($arrINFOS['obs'] != '' && $arrINFOS['obs'] != null) {
  $sqlUpdate .= ' OBS = CONCAT(IFNULL(OBS, ""), IF(OBS IS NULL OR OBS = "", "", "\n"), "' . $arrINFOS['obs'] . '"),  ';
}

// Se o status for NOVO ou DISTRIBUÍDO  atualiza histórico apenas como observação
if ($arrINFOS["status"] != "NOVO" && $arrINFOS["status"] != "DISTRIBUÍDO" && $arrINFOS["status"] != "") {
  $sqlUpdate .=  ' STATUSHIST = CONCAT("' . $arrINFOS['status'] . ' - ' . date("Y-m-d H:i:s") . ' - ' . $nomeUser . '\n", STATUSHIST) ';
} else {
  $sqlUpdate .=  ' STATUSHIST = CONCAT("OBS - ' . date("Y-m-d H:i:s") . ' - ' . $nomeUser . '\n", STATUSHIST) ';
}

$sqlUpdate .= " WHERE REG = ? AND VENDCOD = ? ";

$stmt = $mysqli->prepare($sqlUpdate);
$stmt->bind_param("ii", $arrINFOS['codigo'], $MDCODI);

if ($stmt->execute()) {
  $resp['status'] = 'Cadastro atualizado';
} else {
  $resp['status'] = 'Erro';
  $resp['erro'] = "Não foi possível atualizar o cadastro";
}

return print(json_encode($resp));
