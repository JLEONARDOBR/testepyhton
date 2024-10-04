function togglePassword() {
    const senha = document.getElementById("senha");
    const toggleIcon = document.getElementById("toggle-password");
    
    if (senha.type === "password") {
        senha.type = "text";
        toggleIcon.textContent = "🙈";  // Muda para o ícone de "esconder"
    } else {
        senha.type = "password";
        toggleIcon.textContent = "👁️";  // Volta para o ícone de "mostrar"
    }
}

function acessar() {
    alert("Acessando a próxima tela...");
}
