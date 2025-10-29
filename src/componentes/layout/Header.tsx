import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; 

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
                <Link to="/">Minha Livrariazinha</Link>
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