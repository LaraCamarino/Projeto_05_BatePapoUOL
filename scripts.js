let nomeUsuario;
let mensagens = [];

perguntarUsuario()

function perguntarUsuario() {
    nomeUsuario = prompt("Digite um nome de usuário.");
    let nome = {
       name: nomeUsuario
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
   
    promise.then(pegarMensagens);
    promise.catch(erroEntrada);
}

function erroEntrada(error) {
    console.log(error.response);
    if (error.response.status === 400) {
      alert("Esse nome de usuário já está sendo usado. Por favor, digite um nome de usuário válido.");
      perguntarUsuario();
    }
}

function pegarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    
    promise.then(carregarMensagens);
}

function carregarMensagens(response) {
    mensagens = response.data;
    renderizarMensagens();
}

function renderizarMensagens() {
    const caixaMensagens = document.querySelector(".caixa-mensagens");
    caixaMensagens.innerHTML = "";

    for(let i = 0; i < mensagens.length; i++) {
        if(mensagens[i].type === "status") {
            caixaMensagens.innerHTML += `
            <div class="mensagem status">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome-usuario">${mensagens[i].from}</span>
                <span>${mensagens[i].text}</span>
            </div>
        `;
        }
        else if(mensagens[i].type === "message") {
            caixaMensagens.innerHTML += `
            <div class="mensagem">
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome-usuario">${mensagens[i].from}</span>
                <span>para</span>
                <span class="nome-usuario">${mensagens[i].to}:</span>
                <span class="conteudo-mensagem">${mensagens[i].text}</span>
            </div>
        `;
        }
        else if(mensagens[i].type === "private_message") {
            if(mensagens[i].from === nomeUsuario || mensagens[i].to === nomeUsuario) {
                caixaMensagens.innerHTML += `
                <div class="mensagem reservada">
                    <span class="hora">(${mensagens[i].time})</span>
                    <span class="nome-usuario">${mensagens[i].from}</span>
                    <span>reservadamente para</span>
                    <span class="nome-usuario">${mensagens[i].to}:</span>
                    <span class="conteudo-mensagem">${mensagens[i].text}</span>
                </div>
            `;
            }
        }
    }
    scrollAutomatico();
}

function scrollAutomatico() {
    const caixaMensagens = document.querySelector(".caixa-mensagens");
    const ultimaMensagem = caixaMensagens.lastElementChild;
    ultimaMensagem.scrollIntoView();
}

setInterval(pegarMensagens, 3000);
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
