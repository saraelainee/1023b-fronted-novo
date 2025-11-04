import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GerenciarProdutos from './GerenciarProdutos';
import GerenciarUsuarios from './GerenciarUsuarios';
import GerenciarCarrinhos from './GerenciarCarrinhos';

// Ícones para as abas (você pode substituir por ícones reais depois)
const icons = {
    produtos: '📦',
    usuarios: '👥',
    carrinhos: '🛒'
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
        <div className="min-h-screen flex flex-col items-center bg-transparent p-6 mt-20">
            <div className="w-full max-w-6xl space-y-6">
                {/* Header com breadcrumb */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#344733]">Painel de Administração</h1>
                        <p className="text-sm text-[#8A9B6F] mt-1">
                            Área restrita para gerenciamento do sistema
                        </p>
                    </div>

                    {/* Card com informações do admin */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-[#B99375]/20">
                        <span className="text-sm text-[#344733] font-medium">
                            Admin {localStorage.getItem("nomeUsuario")}
                        </span>
                    </div>
                </div>
                
                {/* Navegação por Abas com ícones */}
                <nav className="flex gap-4 mb-8 pb-4 border-b border-[#B99375]/20">
                    <button 
                        className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                            view === 'produtos' 
                            ? 'bg-gradient-to-r from-[#8A9B6F] to-[#8A9B6F] text-white shadow-lg scale-105' 
                            : 'bg-white text-[#344733] border border-[#8A9B6F] hover:bg-[#F3F4FD] hover:scale-105'
                        }`}
                        onClick={() => setView('produtos')}
                    >
                        <span>{icons.produtos}</span>
                        <span className="font-medium">Gerenciar Produtos</span>
                    </button>
                    <button 
                        className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                            view === 'usuarios' 
                            ? 'bg-gradient-to-r from-[#8A9B6F] to-[#8A9B6F] text-white shadow-lg scale-105' 
                            : 'bg-white text-[#344733] border border-[#8A9B6F] hover:bg-[#F3F4FD] hover:scale-105'
                        }`}
                        onClick={() => setView('usuarios')}
                    >
                        <span>{icons.usuarios}</span>
                        <span className="font-medium">Gerenciar Usuários</span>
                    </button>
                    <button 
                        className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                            view === 'carrinhos' 
                            ? 'bg-gradient-to-r from-[#8A9B6F] to-[#8A9B6F] text-white shadow-lg scale-105' 
                            : 'bg-white text-[#344733] border border-[#8A9B6F] hover:bg-[#F3F4FD] hover:scale-105'
                        }`}
                        onClick={() => setView('carrinhos')}
                    >
                        <span>{icons.carrinhos}</span>
                        <span className="font-medium">Gerenciar Carrinhos</span>
                    </button>
                </nav>

                {/* Conteúdo da aba em um card com sombra suave */}
                <div className="bg-white rounded-xl shadow-md p-8 min-h-[500px] border border-[#B99375]/10">
                    <div className="animate-fadeIn">
                        {view === 'produtos' && <GerenciarProdutos />}
                        {view === 'usuarios' && <GerenciarUsuarios />}
                        {view === 'carrinhos' && <GerenciarCarrinhos />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;