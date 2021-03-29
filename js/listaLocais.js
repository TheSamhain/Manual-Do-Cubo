const carregarLocais = async () => {
  //localStorage.removeItem('login.' + param);

  let html = await fetch('template/locais.html');
  html = await html.text();
  main.innerHTML = html;

  carregarLogo();

  fetch('backend/login/procurarLocais.php', {
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(json => {
      let lista = document.getElementById('lista');
      lista.innerHTML = "";
      
      if (json.status == 'Erro') {
        alert(`Um erro ocorreu ao tentar relizar a operação: \n${json.erro}`);
        return;
      }
      
      if (!Array.isArray(json.lista)) {
        alert(`Não foi possível pesquisar a lista de Locais.\n\nTente acessar pelo link ${window.location}localdesejado`);
        return;
      }

      const ul = document.createElement('ul');
      

      json.lista.forEach(local => {
        let li = document.createElement("li");
        
        li.addEventListener('click', () => {window.location.href = `index.html?local=${local.LOCAL}`});
        li.innerHTML = local.EMPRESA
  
        ul.appendChild(li);
      });


      lista.appendChild(ul);

    }); 
}