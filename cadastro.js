// Variáveis para controlar a confirmação
let celularConfirmado = false;
let emailConfirmado = false;
let dadosUsuario = {}; // Objeto para armazenar os dados do usuário

// Função para atualizar as confirmações conforme o usuário digita
function atualizarConfirmacao() {
    const celularInput = document.getElementById('celular');
    const emailInput = document.getElementById('email');
    const celularPreenchido = document.getElementById('celular-preenchido');
    const emailPreenchido = document.getElementById('email-preenchido');
    
    celularPreenchido.textContent = celularInput.value;
    emailPreenchido.textContent = emailInput.value;

    // Ativa os botões de confirmar se os campos têm valor
    const celularConfirmarBtn = document.getElementById('confirmar-celular-btn');
    const emailConfirmarBtn = document.getElementById('confirmar-email-btn');
    
    celularConfirmarBtn.disabled = celularInput.value === '';
    emailConfirmarBtn.disabled = emailInput.value === '';
}

// Função para confirmar o celular
function confirmarCelular() {
    const celularInput = document.getElementById('celular');
    celularConfirmado = true;
    dadosUsuario.celular = celularInput.value; // Salva o celular no objeto de dados do usuário
    document.getElementById('confirmacao-celular').style.display = 'block'; // Mostra confirmação do celular
    celularInput.disabled = true; // Desabilita o campo de celular após confirmação
    verificarSePodeProsseguir(); // Verifica se o botão de prosseguir pode ser ativado
}

// Função para corrigir o celular
function corrigirCelular() {
    const celularInput = document.getElementById('celular');
    celularInput.value = ''; // Limpa o campo de celular
    celularInput.disabled = false; // Habilita o campo de celular novamente
    celularConfirmado = false; // Reseta a confirmação
    document.getElementById('confirmacao-celular').style.display = 'none'; // Oculta confirmação do celular
    atualizarConfirmacao(); // Atualiza a confirmação para o campo de celular
    verificarSePodeProsseguir(); // Verifica se o botão de prosseguir pode ser ativado
}

// Função para confirmar o e-mail
function confirmarEmail() {
    const emailInput = document.getElementById('email');
    emailConfirmado = true;
    dadosUsuario.email = emailInput.value; // Salva o e-mail no objeto de dados do usuário
    document.getElementById('confirmacao-email').style.display = 'block'; // Mostra confirmação do e-mail
    emailInput.disabled = true; // Desabilita o campo de e-mail após confirmação
    verificarSePodeProsseguir(); // Verifica se o botão de prosseguir pode ser ativado
}

// Função para corrigir o e-mail
function corrigirEmail() {
    const emailInput = document.getElementById('email');
    emailInput.value = ''; // Limpa o campo de e-mail
    emailInput.disabled = false; // Habilita o campo de e-mail novamente
    emailConfirmado = false; // Reseta a confirmação
    document.getElementById('confirmacao-email').style.display = 'none'; // Oculta confirmação do e-mail
    atualizarConfirmacao(); // Atualiza a confirmação para o campo de e-mail
    verificarSePodeProsseguir(); // Verifica se o botão de prosseguir pode ser ativado
}

// Função para verificar se o botão "Prosseguir" pode ser ativado
function verificarSePodeProsseguir() {
    const prosseguirBtn = document.getElementById('prosseguir');
    if (celularConfirmado && emailConfirmado) {
        prosseguirBtn.style.display = 'block'; // Torna o botão visível
    } else {
        prosseguirBtn.style.display = 'none'; // Torna o botão invisível
    }
}

// Função para prosseguir para a próxima tela e salvar os dados
function prosseguir() {
    // Captura o nome inserido
    const nomeInput = document.getElementById('nome');
    dadosUsuario.nome = nomeInput.value; // Salva o nome no objeto de dados do usuário
    
    // Salvar os dados do usuário no localStorage
    localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
    
    // Redireciona para a terceira tela
    window.location.href = 'terceira-tela.html';
}
