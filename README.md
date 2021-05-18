# Aplicativo para vendedores da One

Este aplicativo tem como objetivo permitir que vendedores realizem o cadasto de Clientes, Vendas e Leads.
Também é possivel visualizar o relatório de vendas e comissões.


# :clipboard: TO-DO

## :chart_with_upwards_trend: PROFIN
- [ ] Ao alterar o status para novo, deve limpar as informações do vendedor no app desktop


## :iphone: APP MOBILE ONE

- [x] Na tela de login, posicionar a logo e os campos pouco mais para cima

### :bar_chart: Lista de Leads
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

### :page_facing_up: Relatório de vendas
- [x] Listar todas as vendas no período de 1 ano ou enquanto tiver uma parcela da comissão em aberto  
- [x] Colocar a fonte do texto da parcela vencida e não paga em vermelho  
- [x] Remover as bordas dos campos e colocar uma cor de fundo suave  
- [x] Ao clicar na lupa do teclado a pesquisa não é realizada  
- [x] Incluir um label abaixo do campo de pesquisa informando a quantidade de registros encontrato e o filtro utilizado. Limpar o campo filtro.  
- [x] Remover a linha abaixo do campo de seleção.  


## :smiley: Cadastro de clientes
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


## :money_with_wings: Cadastro de vendas
- [x] Remover as bordas dos campos e colocar uma cor de fundo suave
- [x] Melhorar o agrupamento dos campos. Remover as linhas de grupo
- [x] Só mostrar o campo SALVAR se tiver alguma alteração

- [x] Ajustar link de entrada.
   - Hospedar subdominio em infoel.com.br
   - one.infoel.com.br   - Deve apresentar uma lista das cidades
   - one.infoel.com.br/jaraguadosul - Deve entrar diretamente para a tela de login
