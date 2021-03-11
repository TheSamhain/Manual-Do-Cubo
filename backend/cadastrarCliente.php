<?php
    error_reporting(E_ERROR | E_PARSE |  E_CORE_ERROR |    E_COMPILE_ERROR | E_COMPILE_WARNING |  E_USER_ERROR | E_STRICT  | E_RECOVERABLE_ERROR);
    
    require_once 'config.php';
    require_once 'jwt.php';
    require_once 'utils.php';
    
    $INFOS = $_POST['INFOS'];
    $TOKEN = $_POST['TOKEN'];
    $CHAVE = $_POST['LOCAL'];
 
    $arrINFOS = json_decode($INFOS, true);
    $arrINFOS = array_map('arrayUppercase', $arrINFOS);
    $arrINFOS = array_map('trim', $arrINFOS);
    // Valida o token 
    $resp = array('autenticado' => JWTvalidate($TOKEN, $SEGREDO));
    
    header('Content-Type: application/json');
    
    if (!JWTvalidate($TOKEN, $SEGREDO)){
        return print json_encode($resp);
    }


    if($arrINFOS['cpf'] != null){
        if(!validaCPF($arrINFOS['cpf'])){
            $resp['status'] = 'Erro';
            $resp['erro'] = "CPF inválido";
            
            return print(json_encode($resp));
        }
        
        if(!validateDate($arrINFOS['dataNasc'], 'Y-m-d')){
            $resp['status'] = 'Erro';
            $resp['erro'] = "Data de nascimento inválida";
            
            return print(json_encode($resp));
        }
        
    } else {
        if(!validaCNPJ($arrINFOS['cnpj'])){
            $resp['status'] = 'Erro';
            $resp['erro'] = "CNPJ inválido";
            
            return print(json_encode($resp));
        }
    }

    
    $arrINFOS['tel1'] = validatePhone($arrINFOS['tel1']);
    $arrINFOS['tel2'] = validatePhone($arrINFOS['tel2']);

    if(!$arrINFOS['tel1']){
        $resp['status'] = 'Erro';
        $resp['erro'] = "Telefone inválido";
        
        return print(json_encode($resp));
    }

    if(!$arrINFOS['tel2']){
        $arrINFOS['tel2'] = '';
    }
    
    // Conecta com a base correta
    $mysqli = conectarBD($CHAVE);

    if(!$mysqli){
        $resp = array(
            'autenticado' => false,
            'erro' => 'Local inválido. \nÉ necessário fazer o Login novamente!'
        );
    
        return print(json_encode($resp));
    }

    $bdArray = array(
        'PESSOA' => 'F',
        'EMAIL' => strtolower($arrINFOS['email']),
        'DATACAD' => date("Y-m-d"),
        'SITUACAO' => 'APROVADO',
        'DTSITUACAO' => date("Y-m-d"),
        'MDTEL1' => $arrINFOS['tel1'],
        'MDTEL2' => $arrINFOS['tel2'],

        'MDCEP' => $arrINFOS['cep'],
        'MDEND' => $arrINFOS['rua'],
        'MDNUM' => $arrINFOS['numeroCasa'],
        'MDBAIRRO' => $arrINFOS['bairro'],
        'MDCIDA' => $arrINFOS['cidade'],
        'MDEST' => $arrINFOS['estado'],
        'MDCOMP' => $arrINFOS['complemento']
    );

    if($arrINFOS['cpf'] != null){
        $bdArray['MDCPF'] = $arrINFOS['cpf'];
        $bdArray['MDFIRM'] = $arrINFOS['nome'];
        $bdArray['NASCIMENTO'] = $arrINFOS['dataNasc'];
    } else {
        $bdArray['MDFIRM'] = $arrINFOS['razao'];
        $bdArray['FANTASIA'] = $arrINFOS['fantasia'];
    }

    // Procura no cadastro pelo CPF
    $sqlSelectCpf = "SELECT * FROM maladir WHERE ";

    if($arrINFOS['cpf'] != null){
        $sqlSelectCpf .= " MDCPF = ? LIMIT 1";
        $pesq =  $arrINFOS['cpf'];
    } else {
        $sqlSelectCpf .= " MDCGC = ? LIMIT 1";
        $pesq =  $arrINFOS['cnpj'];
    }


    $mysqli->set_charset("utf8");
    $stmt = $mysqli->prepare($sqlSelectCpf);
    $stmt->bind_param("s", $pesq);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (mysqli_num_rows($result) > 0) {
        // Atualizar cadastro existente
        while ($row = mysqli_fetch_assoc($result)) {
            unset($bdArray['MDCPF']);
            unset($bdArray['MDCGC']);
            
            $sqlUpdate = "UPDATE maladir SET ";
            
            foreach ($bdArray as $key => $value) {
                $sqlUpdate .= "$key = '$value', ";
            }
            
            $sqlUpdate = substr($sqlUpdate, 0, strlen($sqlUpdate) - 2);
            
            if($arrINFOS['cpf'] != null){
                $sqlUpdate .= "WHERE MDCPF = ? ";
            } else {
                $sqlUpdate .= "WHERE MDCGC = ? ";
            }
            
            $stmt = $mysqli->prepare($sqlUpdate);
            $stmt->bind_param("s", $pesq);

            if($stmt->execute()){
                $resp['status'] = 'Cadastro atualizado';
            }else {
                $resp['status'] = 'Erro';
                $resp['erro'] = "Não foi possível atualizar o cadastro";
            }
            
            break;
        }
    } else {
        // Cria novo cadastro
        $bdArray['CATEGORIA'] = 'CLIENTE';

        $sqlInsert = "INSERT INTO maladir ( ";
        
        foreach ($bdArray as $key => $value) {
            $sqlInsert .= "$key, ";
        }
        
        $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) VALUES ( ";

        foreach ($bdArray as $key => $value) {
            $sqlInsert .= "'$value', ";
        }

        $sqlInsert = substr($sqlInsert, 0, strlen($sqlInsert) - 2) . " ) ";

        $stmt = $mysqli->prepare($sqlInsert);

        if($stmt->execute()){
            $resp['status'] = 'Cadastro realizado';
        }else {
            $resp['status'] = 'Erro';
            $resp['erro'] = "Não foi possível realizar o cadastro";
        }
    }

    print(json_encode($resp));
    
    ?>