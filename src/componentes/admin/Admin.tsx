// ARQUIVO: src/componentes/admin/Admin.tsx (NOVO)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GerenciarProdutos from './GerenciarProdutos';
import GerenciarUsuarios from './GerenciarUsuarios';
import GerenciarCarrinhos from './GerenciarCarrinhos';

// Estilos simples para as abas
const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px'
    },
    navButton: {
        padding: '10px 15px',
        border: '1px solid #ccc',
        background: '#f0f0f0',
        cursor: 'pointer'
    },
    navButtonActive: {
        padding: '10px 15px',
        border: '1px solid #007bff',
        background: '#007bff',
        color: 'white',
        cursor: 'pointer'
    }
};

function Admin() {
    // Controla qual "aba" está ativa
    const [view, setView] = useState('produtos'); // Começa em 'produtos'
    const navigate = useNavigate();

    // Proteção da Rota: Verifica se o usuário é admin
    useEffect(() => {
        const tipoUsuario = localStorage.getItem("tipoUsuario");
        if (tipoUsuario !== 'admin') {
            // TAREFA SARA: Mensagem amigável
            alert("Acesso negado. Você não tem permissão para acessar esta página.");
            navigate("/"); // Redireciona para a home
        }
    }, [navigate]);

    return (
        <div>
            <h1>Painel de Administração</h1>
            
            {/* Navegação por Abas */}
            <nav style={styles.nav}>
                <button 
                    style={view === 'produtos' ? styles.navButtonActive : styles.navButton}
                    onClick={() => setView('produtos')}
                >
                    Gerenciar Produtos
                </button>
                <button 
                    style={view === 'usuarios' ? styles.navButtonActive : styles.navButton}
                    onClick={() => setView('usuarios')}
                >
                    Gerenciar Usuários
                </button>
                <button 
                    style={view === 'carrinhos' ? styles.navButtonActive : styles.navButton}
                    onClick={() => setView('carrinhos')}
                >
                    Gerenciar Carrinhos
                </button>
            </nav>

            {/* Renderização condicional da "aba" selecionada */}
            {view === 'produtos' && <GerenciarProdutos />}
            {view === 'usuarios' && <GerenciarUsuarios />}
            {view === 'carrinhos' && <GerenciarCarrinhos />}
        </div>
    );
}

export default Admin;