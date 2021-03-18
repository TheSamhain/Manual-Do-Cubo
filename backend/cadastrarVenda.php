<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);

    require_once 'config.php';
    require_once 'jwt.php';
    require_once 'utils.php';

    $TOKEN = $_POST['TOKEN'];
    $CHAVE = $_POST['LOCAL'];
    $INFOS = $_POST['INFOS'];

    $arrINFOS = json_decode($INFOS, true);
    $tipo = $arrINFOS['tipo'];
    $arrINFOS = array_map('arrayUppercase', $arrINFOS);
    $arrINFOS['tipo'] = $tipo;
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
    $baseCentral = ($arrConection[1] != null && $arrConection[1] != '') ? $arrConection[1].'.' : '' ;
    $numFilial = trim($arrConection[2]);

    if (!$mysqli) {
        $resp = array(
            'autenticado' => false,
            'erro' => 'Local inválido. \nÉ necessário fazer o Login novamente!'
        );

        return print(json_encode($resp));
    }
    
    $arrINFOS['valorCarta'] = preg_replace('/[^0-9]/is', '',  $arrINFOS['valorCarta']);
    $arrINFOS['valorCarta'] = substr_replace($arrINFOS['valorCarta'], '.', strlen($arrINFOS['valorCarta']) - 2, 0);

    $bdArray = array(
        'DTADESAO' => $arrINFOS['dataAdesao'],
        'TIPO' => $arrINFOS['tipo'],
        'COTA' => $arrINFOS['cota'],
        'GRUPO' => $arrINFOS['grupo'],
        'CONTRATO' => $arrINFOS['numContrato'],

        'DATACAD' => $arrINFOS['dataAdesao'],
        'ALTULTDATA' => $arrINFOS['dataAdesao'],
        'VALORCARTA' => $arrINFOS['valorCarta'],
        'FILIAL' => $numFilial
    );

    if($arrINFOS['tipoPessoa'] == 'F'){
        $bdArray['CLICPF'] = $arrINFOS['cpf'];
    } else {
        $bdArray['CLICPF'] = $arrINFOS['cnpj'];
    }

    $idUser = json_decode(base64_decode($TOKEN))->ID;
    $user = json_decode(base64_decode($TOKEN))->NOME;

    // Procura no cadastro usuário
    $sqlSelectUsuario = "SELECT * FROM ".$baseCentral."maladir WHERE MDCODI = (SELECT MDCODI FROM usuarios WHERE REG = ? ) LIMIT 1";

    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sqlSelectUsuario);
    $stmt->bind_param("i", $idUser);
    $stmt->execute();
    $result = $stmt->get_result();

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $bdArray['VENDMDCODI'] = $row['MDCODI'];
            $bdArray['VENDMDFIRM'] = $row['MDFIRM'];
            $bdArray['USUARIO'] = $user;
            $bdArray['ALTULTUSER'] = $user;

            break;
        }
    } else {
        $resp['status'] = 'Erro';
        $resp['erro'] = 'Erro no cadastro do usuário! Verifique seu cadastro no sistema e tente novamente!';

        return print(json_encode($resp));
    }

    $sqlSelectCliente = "SELECT * FROM ".$baseCentral."maladir WHERE ";
    
    if($arrINFOS['tipoPessoa'] == 'F'){
        $sqlSelectCliente .= " MDCPF = '".$arrINFOS['cpf']."' ";
    } else {
        $sqlSelectCliente .= " MDCGC = '".$arrINFOS['cnpj']."' ";
    }

    $sqlSelectCliente .= " AND (COMPARTILHADO = 'S' OR FILIAL = '". $numFilial."')  LIMIT 1 ";

    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sqlSelectCliente);
    $stmt->execute();
    $result = $stmt->get_result();

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $bdArray['CLIMDCODI'] = $row['MDCODI'];
            $bdArray['CLIMDFIRM'] = $row['MDFIRM'];

            break;
        }
    } else {
        $resp['status'] = 'Erro';
        $resp['erro'] = 'Erro no cadastro do cliente! Verifique o CPF/CNPJ e efetue a venda novamente!';

        return print(json_encode($resp));
    }

    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sqlSelectCliente);
    $stmt->execute();
    $result = $stmt->get_result();


    $sqlInsert = "INSERT INTO ".$baseCentral."conscomiss ( ";

    foreach ($bdArray as $key => $value) {
        $sqlInsert .= "$key, ";
    }

    $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) VALUES ( ";

    foreach ($bdArray as $key => $value) {
        $sqlInsert .= "'$value', ";
    }

    $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) ";

    $stmt = $mysqli->prepare($sqlInsert);

    if ($stmt->execute()) {
        $resp['status'] = 'Venda cadastrada';
    } else {
        $resp['status'] = 'Erro';
        $resp['erro'] = "Não foi possível cadastrar a venda.";
        $resp['sql'] = $sqlInsert;
    }

    print(json_encode($resp));
