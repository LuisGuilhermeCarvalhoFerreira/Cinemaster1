document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
  
    if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
      alert('Login bem-sucedido!');
      window.location.href = 'index.html'; // redireciona para a página principal
    } else {
      alert('E-mail ou senha incorretos!');
    }
  });
  