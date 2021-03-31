<?php
error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

require_once '../config.php';
require_once '../jwt.php';
require_once '../utils.php';

$INFOS = $_POST['INFOS'];
$TOKEN = $_POST['TOKEN'];
$CHAVE = $_POST['LOCAL'];

$arrINFOS = json_decode($INFOS, true);
$arrINFOS = array_map('trim', $arrINFOS);

$arrINFOS['novaSenha1'] = md5($arrINFOS['novaSenha1']);
$arrINFOS['novaSenha2'] = md5($arrINFOS['novaSenha2']);
$arrINFOS['senhaAtual'] = md5($arrINFOS['senhaAtual']);
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
    'erro' => 'Local inválido. \nÉ necessário fazer o Login novamente!'
  );

  return print(json_encode($resp));
}

if ($arrINFOS['novaSenha1'] == "" || $arrINFOS['novaSenha2'] == "" || $arrINFOS['senhaAtual'] == "") {
  $resp['status'] = 'Erro';
  $resp['erro'] = "Todas as senhas devem ser inseridas";

  return print(json_encode($resp));
}

if ($arrINFOS['novaSenha1'] != $arrINFOS['novaSenha2']) {
  $resp['status'] = 'Erro';
  $resp['erro'] = "As senhas não conferem";

  return print(json_encode($resp));
}

$nomeUser = json_decode(base64_decode($TOKEN))->NOME;

// Procura no cadastro pelo CPF
$sql = "SELECT REG, NOME, SENHA FROM usuarios WHERE NOME = ? AND SENHA = ? LIMIT 1 ";


$mysqli->set_charset("utf8");
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ss", $nomeUser, $arrINFOS['senhaAtual']);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) > 0) {  
  $row = mysqli_fetch_assoc($result);

  $sqlUpdate = "UPDATE usuarios SET SENHA = ? WHERE REG = ? ";

  $mysqli->set_charset("utf8");
  $stmt = $mysqli->prepare($sqlUpdate);
  $stmt->bind_param("si", $arrINFOS['novaSenha1'],  $row["REG"]);

  if ($stmt->execute()) {
    $resp['status'] = 'Cadastro atualizado';
  } else {
    $resp['status'] = 'Erro';
    $resp['erro'] = "Não foi possível atualizar o cadastro";
  }
} else {
  $resp['status'] = 'Erro';
  $resp['erro'] = "A senha está incorreta";
}

print(json_encode($resp));
