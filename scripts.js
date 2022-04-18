let nomeUsuario;
let mensagens = [];

function perguntarUsuario() {
    nomeUsuario = document.querySelector(".digite-usuario").value;
    let nome = {
       name: nomeUsuario
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);

    if(nomeUsuario === "") {
        alert("Digite um nome válido.")
        return;
    }
   
    promise.then(entrarChat);
    promise.catch(erroEntrada);
}

function entrarChat() {
    document.querySelector(".pagina-inicial").classList.add("esconder");
    document.querySelector(".conteiner").classList.remove("esconder");
    
    setInterval(continuarLogado, 4000);

    pegarMensagens();
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

function adicionarNovaMensagem() {
    const mensagemDigitada = document.querySelector(".digite-mensagem").value;
    const novaMensagem = {
        from: nomeUsuario,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    };
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);
    
    if(mensagemDigitada === "") {
        alert("Digite alguma coisa.")
        return;
    }

    promise.then(envioMensagens);
    promise.catch(erroMensagem);

}

function envioMensagens() {
    pegarMensagens();
    document.querySelector(".digite-mensagem").value = "";
}

function erroMensagem(error) {
    console.log(error.response);
    if (error.response.status === 400) {
        alert("Houve um erro ao enviar a mensagem. Por favor, entre novamente.");
        window.location.reload();
    }
}

setInterval(pegarMensagens, 3000);

function continuarLogado() {
    let nome = {
        name: nomeUsuario
     }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
    console.log("estou logado");

    promise.catch(deslogarUsuario);
}

function deslogarUsuario(error) {
    console.log(error.response);
    alert("Você ficou muito tempo inativo. Por favor, entre novamente.");
    window.location.reload();
}

let inputEntrar = document.getElementById("submit-entrar");
inputEntrar.addEventListener("keyup", envioEntrar);

function envioEntrar(event) {
    if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById("button-entrar").click();
  }
}

let inputMensagem = document.getElementById("submit");
inputMensagem.addEventListener("keyup", envioEnter);

function envioEnter(event) {
    if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById("button").click();
  }
}