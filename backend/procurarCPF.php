<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
    
    require_once 'config.php';
    require_once 'jwt.php';
    
    $CPF = $_POST['CPF'];
    $TOKEN = $_POST['TOKEN'];
    $CHAVE = $_POST['LOCAL'];
 
    // Valida o token 
    $resp = array('autenticado' => JWTvalidate($TOKEN, $SEGREDO));
    
    header('Content-Type: application/json');
    
    if (!JWTvalidate($TOKEN, $SEGREDO)){
        return print json_encode($resp);
    }
    
    // Conecta com a base correta
    $mysqli = conectarBD($CHAVE);

    if(!$mysqli){
        $resp = array(
            'autenticado' => false,
            'erro' => 'Local inválido'
        );
    
        return print(json_encode($resp));
    }
    
    // Procura no cadastro pelo CPF
    $sql = "SELECT * FROM maladir WHERE MDCPF = ? LIMIT 1";

    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $CPF);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $arr = array(
                'ID' => $row['MDCODI'],
                'NOME' => $row['MDFIRM']
            );

            $resp['cliente'] = $arr;
        
            break;
        }
    }

    return  print(json_encode($resp));


?>