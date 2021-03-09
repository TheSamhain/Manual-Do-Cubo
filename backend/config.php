<?php
$SEGREDO = 'oneWEB2021'; // Segredo do JWT

function conectarBD(string $chave){
    if($chave == ''){
        return false;
    }

    // CNX mobiles
    $cnxServidor = "exp_inf_mysql.infoel.info";
    $cnxUsuario_bd = "cnxmobiles";
    $cnxSenha_bd = "movinfoel7913";
    $cnxBasedados = "cnx_mobiles";
    $cnxPorta = 3308;
    $cnxMysqli = mysqli_connect($cnxServidor, $cnxUsuario_bd, $cnxSenha_bd, $cnxBasedados, $cnxPorta);

    $sql = 'SELECT * FROM parametros WHERE CHAVE = ? AND APP = "ONE_WEB" LIMIT 1 ';

    $cnxMysqli->set_charset("utf8");
    $stmt = $cnxMysqli->prepare($sql);
    $stmt->bind_param("s", $chave);
    $stmt->execute();
    $result = $stmt->get_result();

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            return mysqli_connect($row['SERVIDOR'], $row['LOGIN'], $row['SENHA'], $row['BASE'], $row['PORTA']);
            break;
        }
    } else {
        return false;
    }
}
?>