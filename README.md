# Aplicativo para vendedores da One

Este aplicativo tem como objetivo permitir que vendedores realizem o cadasto de Clientes, Vendas e Leads.
Também é possivel visualizar o relatório de vendas e comissões.


# :clipboard: TO-DO

## PROFIN
- [x] Ao alterar o status para novo, deve limpar as informações do vendedor no app desktop


## APP MOBILE ONE

- [x] Na tela de login, posicionar a logo e os campos pouco mais para cima

### Lista de Leads
- [x] Alinhar as informações do banco de dados  
- [x] Mostrar em qual loja está o lead  
- [x] CPF/CNPJ Condicional  
- [x] Não pedir para alterar estatus quando incluir observação  
- [x] Ao salvar atualizar somente o registro e não a lista toda  
- [x] Incluir no início da lista com o resumo, e um gráfico de pizza com os status dos leads daquele vendedor.  
- [x] Listar na seguinte ordem:  DISTRIBUÍDO, CONTATADO, PROPOSTA ENVIADA, EM NEGOCIAÇÃO, PROPOSTA ACEITA e PROPOSTA NEGADA  
- [x] Os status PROPOSTA ACEITA e PROPOSTA NEGADA só devem aparecer na lista pelo período de 15 dias a partir da data do status  
- [x] Trocar o ícone do atalho leads.  
- [x] Colocar a barra de atalhos acima do título da janela  
- [x] Permitir que o vendedor cadastre LEADS.  
- [x] Permitir que o vendedor altere sua própria senha.  

### Relatório de vendas
- [x] Listar todas as vendas no período de 1 ano ou enquanto tiver uma parcela da comissão em aberto  
- [x] Colocar a fonte do texto da parcela vencida e não paga em vermelho  
- [x] Remover as bordas dos campos e colocar uma cor de fundo suave  
- [x] Ao clicar na lupa do teclado a pesquisa não é realizada  
- [x] Incluir um label abaixo do campo de pesquisa informando a quantidade de registros encontrato e o filtro utilizado. Limpar o campo filtro.  
- [x] Remover a linha abaixo do campo de seleção.  


## Cadastro de clientes
- [x] Remover as bordas dos campos e colocar uma cor de fundo suave  
- [x] Melhorar o agrupamento dos campos. Remover as linhas de grupo
   - Dados da pessoa
      - Tipo
      - CPF/CNPJ
      - Nome completo
      - Data de nascimento  
   - Contato
   - Endereço
   
- [x] Só mostrar o campo SALVAR se tiver alguma alteração  


## Cadastro de vendas
- [x] Remover as bordas dos campos e colocar uma cor de fundo suave
- [x] Melhorar o agrupamento dos campos. Remover as linhas de grupo
- [x] Só mostrar o campo SALVAR se tiver alguma alteração

- [x] Ajustar link de entrada.
   - Hospedar subdominio em infoel.com.br
   - one.infoel.com.br   - Deve apresentar uma lista das cidades
   - one.infoel.com.br/jaraguadosul - Deve entrar diretamente para a tela de login

# :mortar_board: Treinamento com vendedores  

## Idéias
- Utilizar as planilhas, relatórios e ações vinculadas do Sistema ProFIN.
- Utilizar a plataforma de controle de comissões com área exclusiva para os treinamentos.
- Treinamento através de vídeos.
- Usar módulos separados com títulos.
- Só pode passar para o próximo vídeo se assistir o anterior; 
- As perguntas só devem aparecer depois que todos os vídeos do módulo forem assistidos.  
- Assim que submeter todas as respostas o sistema deve validar automaticamente todas as questões com respostas fechadas e liberar o próximo módulo com 80% de acerto.
- As perguntas do módulo só devem aparecer quando:
  - Os vídeos dos respectivo módulos já estiverem 100% assistidos.
  - Ou já tiverem respostas, permitindo a revisulaização.
- Os vídeos serão enviados através de conta FTP, a mesma utilizada para envio de arquivos vinculados do Sistema ProFIN.
- Mesmo depois das perguntas terem sido respondidas será possível assistir os vídeos novamente.
- A lista de módulos deve conter todos, mas permitir acesso somente aos liberados conforme forem validas as respostas.

## O que será feito no ProFIN:
- Cadastro de módulos.
- Cadastro de videos.
- Cadastro das perguntas.
- Disponibilização do módulo para o aluno.
- Cancelamento do módulo para o aluno refazer.
- Relatórios estatísticos.
- Listas de respostas.

## O que será feito no app web
- Será criado um novo ícone para acesso aos treinamentos.
- Terá duas telas:
    - Uma contendo a lista de módulos criados para o aluno
    - E outra com os vídeos e perguntas do módulo selecionado.

## Cadastro de Módulos
Campo     | Tipo        | Descrição
----------|-------------|------------------
ID        | Medumint    | Id do registro
MODULO    | Varchar(50) | Nome do módulo
DESCRICAO | Text        | Descrição e instruções 
ATIVO     | char(1)     | S/N  

## Cadastro dos vídeos
Campo     | Tipo          | Descrição
----------|---------------|-------------------
ID        | Medumint      | Id do registro
IDMODULO  | Mediumint     | Id do módulo
TITULO    | Varchar(50)   | Título do vídeo
ARQUIVO   | Varchar(100)  | Nome do arquivos

## Cadastro das perguntas
Campo     | Tipo         | Descrição
----------|--------------|-------------------
ID        | Medumint     | Id do registro
IDMODULO  | Medumint     | Id do módulo
ORDEM     | Tinint       | Ordem em que vai aparecer
TEXTO     | Mediumtext   | Texto da pergunta
TIPO      | Varchar(10)  | Tipo da resposta (QUANT/QUALI/MULT)   
OPCOES    | Text         | Opções para as perguntas
RESPOSTA  | Text         | Respostas corretas

## Cadastro das respostas
Campo     | Tipo       | Descrição
----------|------------|-------------------
ID        | Medumint   | Id do registro
IDPERGUNTA| Mediumint  | Id da pergunta
IDUSUARIO | Mediumint  | Id do usuário
RESPOSTA  | Text       | Resposta das respostas
DATAHORA  | DateTime   | Data e hora da resposta
~~RESPOK~~ | Char(1)    | S/N

## Cadastro da visualização dos vídeos
Campo      | Tipo       | Descrição
---------- |------------|-------------------
ID         | Medumint   | Id do registro
IDVIDEO    | Mediumint  | Id do vídeo
IDUSUARIO  | Mediumint  | id do usuário
VISUALIZADO| Mediumint  | Tempo decorrido, em segundos, que o vídeo foi visualizado
DATAHORA   | Datetime   | Data e hora do início da visualização

### Nome das tabelas

Tabelas              | Nome no BD
---                  | ---
Módulos              | plandiv00005
Vídeos               | plandiv00006
Perguntas            | plandiv00007
Respostas            | treinamento_resposta 
Visualização Vídeos  | treinamento_visua_videos


## Exemplo. Lista de módulos

**Módulo 1**  
```
  Descrição e instruções do módulo   
  com texto e quebra de linha automática.  
        Vídeo [Titulo]   XXXXXXXXOO - 80%  
  Questões respondidas   XXXOOOOOOO 3/12 - 25%  
  [Visualizar]
```
  
**Módulo 2**    
```
Descrição e instruções do módulo   
  com texto e quebra de linha automática.  
        Vídeo [Titulo]   XXXXXXXXOO - 80%  
  Questões respondidas   XXXOOOOOOO 3/12 - 25%  
```
  
----------------------------------------------

## Tempo de desenvolvimento estimado
Descrição                                               | Horas        
---------                                               |------:
Estruturação do banco de dados                          | 4
Prototipagem/design das telas                           | 6
Projeção dos sistemas de módulos/videos/perguntas       | 6
Desenvolvimento (front-end) da tela de lista de módulos | 8
Desenvolvimento (front-end) da tela de aprendizado      | 8
Desenvolvimento (back-end) do sistema de videos         | 6
Desenvolvimento (back-end) do sistema de peguntas       | 6
Desenvolvimento (back-end) do sistema de módulos        | 4
---                                                     | -
Total                                                   | 48

