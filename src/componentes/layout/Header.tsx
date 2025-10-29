// ARQUIVO: src/componentes/layout/Header.tsx (NOVO)
import { Link, useNavigate } from 'react-router-dom';
//import './Header.css'; // Vamos criar um CSS simples para ele

function Header() {
    const navigate = useNavigate();

    // TAREFA SARA: Pega nome e tipo do localStorage
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // TAREFA VÂNIA: Função de Logout
    function handleLogout() {
        // Limpa tudo do localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("tipoUsuario");
        
        // Redireciona para a tela de login
        navigate("/login");
    }

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <Link to="/">Minha Loja</Link>
            </div>
            
            <nav className="navbar-links">
                <Link to="/">Produtos</Link>
                <Link to="/carrinho">Carrinho</Link>
                
                {/* TAREFA SARA/LAÍSA: Só mostra o link de Admin se o tipo for 'admin' */}
                {tipoUsuario === 'admin' && (
                    <Link to="/admin" className="admin-link">Admin</Link>
                )}
            </nav>

            <div className="navbar-user">
                {nomeUsuario ? (
                    <>
                        {/* TAREFA SARA: Exibe nome e tipo do usuário */}
                        <span className="user-info">
                            Olá, {nomeUsuario} ({tipoUsuario})
                        </span>
                        {/* TAREFA VÂNIA: Botão de Logout */}
                        <button onClick={handleLogout} className="logout-button">
                            Sair
                        </button>
                    </>
                ) : (
                    // Se não estiver logado, mostra o botão de Login
                    <Link to="/login" className="login-button">Login</Link>
                )}
            </div>
        </header>
    );
}

export default Header;

/* -----------------------------------------------------------------
   CRIE TAMBÉM o arquivo 'src/componentes/layout/Header.css'
   (Pode colocar este CSS no 'App.css' ou 'index.css' se preferir)
   -----------------------------------------------------------------

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #333;
    color: white;
}
.navbar-logo a {
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
}
.navbar-links {
    display: flex;
    gap: 1.5rem;
}
.navbar-links a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
}
.navbar-links a:hover {
    text-decoration: underline;
}
.navbar-links .admin-link {
    color: #ffc107; /* Amarelo para destacar o Admin */
//     font-weight: bold;
// }
// .navbar-user {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
// }
// .user-info {
//     font-size: 0.9rem;
// }
// .logout-button, .login-button {
//     padding: 0.5rem 1rem;
//     background-color: #f44336;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
// }
// .login-button {
//      background-color: #4CAF50;
//      text-decoration: none;
// }
// .logout-button:hover {
//     background-color: #d32f2f;
// }

// */