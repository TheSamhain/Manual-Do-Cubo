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
    $sql = "SELECT * FROM maladir WHERE ";
    
    if(strlen($CPFCNPJ) == 14){
        $sql .= " MDCPF = ? LIMIT 1";
    } else {
        $sql .= " MDCGC = ? LIMIT 1";
    }
    
    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $CPFCNPJ);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $arr = array(
                'ID' => $row['MDCODI'],
                'EMAIL' => $row['EMAIL'],
                'TEL1' =>  $row['MDTEL1'],
                'TEL2' =>  $row['MDTEL2'],

                'ENDCEP' => $row['MDCEP'],
                'ENDLOGRADOURO' => $row['MDEND'],
                'ENDNUMERO' => $row['MDNUM'],
                'ENDBAIRRO' => $row['MDBAIRRO'],
                'ENDMUNICIPIO' => $row['MDCIDA'],
                'ENDESTADO' => $row['MDEST'],
                'ENDCOMPLEMENTO' => $row['MDCOMP']
            );

            if(strlen($CPFCNPJ) == 14){
                $arr['NOME'] = $row['MDFIRM'];
                $arr['DTNASCIMENTO'] = $row['NASCIMENTO'];
            } else {
                $arr['RAZAO'] = $row['MDFIRM'];
                $arr['FANTASIA'] = $row['FANTASIA'];                
            }

            $resp['cliente'] = $arr;
        
            break;
        }
    }

    return  print(json_encode($resp));
