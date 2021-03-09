<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
    
    require_once 'config.php';
    require_once 'jwt.php';
    
    $USUARIO = $_POST['USUARIO'];
    $SENHA = $_POST['SENHA'];
    $CHAVE = $_POST['LOCAL'];
    $SENHA = md5($SENHA);

    $mysqli = conectarBD($CHAVE);
    
    header('Content-Type: application/json');

    if(!$mysqli){
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
        while ($row = mysqli_fetch_assoc($result)) {
            $arr = array('NOME' => $row['NOME'], 'ID' => $row['REG']);
            $token = JWTcreate($arr, $SEGREDO);

            $resp = array(
                'logado' => (!!$token),
                'token' => $token
            );

            if(!!$token){
                $resp['erro'] = 'Token inválido';
            }
        
            break;
        }
    } else {
        $resp = array(
            'logado' => false,
            'erro' => 'Usuário ou senha inválido'
        );

        return print(json_encode($resp));
    }
    
    mysqli_stmt_close($stmt);
    
    
    $sql = "SELECT * 
            FROM configuracoes 
            WHERE AREA = 'GERAL' 
              AND SECAO = 'Impressão' 
              AND ITEM = 'Geral' 
              AND SUBITEM IN ('Título 1 do cabeçalho', 'Título 2 do cabeçalho', 'Título 3 do cabeçalho') ";
    
    $mysqli->set_charset("utf8");
    $result = mysqli_query($mysqli, $sql);
    
    $i = 1;
    $titulos = array();
    
    while ($row = mysqli_fetch_assoc($result)) {
        $titulos['titulo'.$i] = $row['VALOR'];
        $i++;
    }
    
    $resp['titulos'] = $titulos;

    print json_encode($resp);
    
    $mysqli->close();

?>