<?php
$SEGREDO = 'oneWEB2021'; // Segredo do JWT

function conectarBD($chave)
{
    if ($chave == '') {
        return array(false, false, false);
    }

    // CNX mobiles
    $cnxServidor = "exp_inf_mysql.infoel.info";
    $cnxUsuario_bd = "cnxmobiles";
    $cnxSenha_bd = "movinfoel7913";
    $cnxBasedados = "cnx_mobiles";
    $cnxPorta = 3309;
    $cnxMysqli = mysqli_connect($cnxServidor, $cnxUsuario_bd, $cnxSenha_bd, $cnxBasedados, $cnxPorta);

    $sql = 'SELECT * FROM parametros WHERE CHAVE = ? AND APP = "ONE_WEB" LIMIT 1 ';

    $cnxMysqli->set_charset("utf8");
    $stmt = $cnxMysqli->prepare($sql);
    $stmt->bind_param("s", $chave);
    $stmt->execute();
    $result = $stmt->get_result();


    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);

        $mysqli = mysqli_connect($row['SERVIDOR'], $row['LOGIN'], $row['SENHA'], $row['BASE'], $row['PORTA']);

        $sqlBaseCentral = "SELECT * FROM configuracoes WHERE AREA = 'GERAL' AND SECAO = 'Sistema' AND ITEM = 'Geral' AND SUBITEM = 'Nome da base central' ";
        $mysqli->set_charset("utf8");
        $stmt = $mysqli->prepare($sqlBaseCentral);
        $stmt->execute();
        $resultSelect = $stmt->get_result();
        $rowBase = mysqli_fetch_assoc($resultSelect);
        $baseCentral = $rowBase['VALOR'];

        
        $sqlFilial = "SELECT * FROM filiais WHERE BASE = ? ";
        $mysqli->set_charset("utf8");
        $stmt = $mysqli->prepare($sqlFilial);
        $stmt->bind_param("s", $row['BASE']);
        $stmt->execute();
        $resultSelect = $stmt->get_result();
        $rowFilial = mysqli_fetch_assoc($resultSelect);
        $filial = $rowFilial['NUM'];
        
        
        return array(
            $mysqli,
            $baseCentral,
            $filial
        );
    } else {
        return array(false, false, false);
    }
}
