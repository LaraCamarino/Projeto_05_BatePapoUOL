let nomeUsuario;

perguntarUsuario()

function perguntarUsuario() {
    nomeUsuario = prompt("Digite um nome de usuário.");
    let nome = {
       name: nomeUsuario
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
   
    
    promise.catch(erroEntrada);
}

function erroEntrada(error) {
    console.log(error.response);
    if (error.response.status === 400) {
      alert("Esse nome de usuário já está sendo usado. Por favor, digite um nome de usuário válido.");
      perguntarUsuario();
    }
}

setInterval(continuarLogado, 4000);

function continuarLogado() {
    let nome = {
        name: nomeUsuario
     }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);

    promise.catch(deslogarUsuario);
}

function deslogarUsuario(error) {
    console.log(error.response);
    alert("Você ficou muito tempo inativo. Por favor, entre novamente.");
    window.location.reload();
}
