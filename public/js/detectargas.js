//btn logout
function handleLogout() {
    localStorage.removeItem('cod_usuario'); 
    window.location.href = 'login.html';    
  }