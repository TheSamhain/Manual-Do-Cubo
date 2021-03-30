<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
header("Content-Type: application/json");

require_once "../config.php";
require_once "../jwt.php";
require_once "../utils.php";

$INFOS = $_POST["INFOS"];
$TOKEN = $_POST["TOKEN"];
$CHAVE = $_POST["LOCAL"];

$arrINFOS = json_decode($INFOS, true);
$arrINFOS = array_map("arrayUppercase", $arrINFOS);
$arrINFOS = array_map("trim", $arrINFOS);

// Valida o token 
$resp = array("autenticado" => JWTvalidate($TOKEN, $SEGREDO));

if (!JWTvalidate($TOKEN, $SEGREDO)) {
  return print json_encode($resp);
}


if (!validaCPF($arrINFOS['cpf']) && ($arrINFOS['cpf'] != '')) {
  $resp['status'] = 'Erro';
  $resp['erro'] = "CPF inválido";

  return print(json_encode($resp));
}

if (($arrINFOS['telefone'] != '')) {
  $arrINFOS['telefone'] = formatPhone($arrINFOS['telefone']);

  if (!$arrINFOS['telefone']) {
    $resp['status'] = 'Erro';
    $resp['erro'] = "Telefone inválido";

    return print(json_encode($resp));
  }
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
$VENDCODI = $row['MDCODI'];
$VENDNOME = $row['MDFIRM'];


$bdArray = array(
  'DATA' => date("Y-m-d"),
  'CPFCNPJ' => $arrINFOS['cpf'],
  'MDFIRM' => $arrINFOS['nome'],
  'FONE' => $arrINFOS['telefone'],
  'EMAIL' => mb_strtolower($arrINFOS['email'], 'UTF-8'),
  'CIDADE' => $arrINFOS['cidade'],
  'CANAL' => 'APLICATIVO',
  'STATUS' => $arrINFOS['status'],
  'OBS' => $arrINFOS['obs'],
  'STATUSHIST' => $arrINFOS['status'] . ' - ' . date("d/m/Y H:i:s") . ' - ' . $nomeUser,
  'STATUSDH' => date("Y-m-d H:i:s"),
  'STATUSUSER' => $nomeUser,
);

if($arrINFOS['status'] != 'NOVO'){
  $bdArray['VENDCOD'] = $VENDCODI;
  $bdArray['VENDNOME']  = $VENDNOME;
  $bdArray['FILIAL'] = $numFilial;
} else {
  $bdArray['FILIAL'] = '00';
}

$cadastro = inserirRegistro($mysqli, $bdArray, "consleads", $baseCentral);

if($cadastro && ($cadastro > 0)){
  $resp['status'] = 'Cadastro realizado';
  $resp['id'] = $cadastro;
} else {
  $resp['status'] = 'Erro';
  $resp['erro'] = "Não foi possível realizar o cadastro";
}

return print(json_encode($resp));
