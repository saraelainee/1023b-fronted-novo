import { useState, useEffect } from 'react';
import api from '../../api/api';

type UsuarioType = {
    _id: string;
    nome: string;
    email: string;
    idade: number;
    role: string;
}

function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);

    // Função para buscar os usuários
    function fetchUsuarios() {
        // TAREFA LORENA: Listar todos os usuários cadastrados
        api.get('/admin/users')
            .then(res => {
                setUsuarios(res.data.data); // O controller do backend encapsula em 'data'
            })
            .catch(err => alert(`Erro ao buscar usuários. ${err}`));
    }

    // Busca os usuários ao carregar
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // TAREFA SARA: Permitir que o ADMIN exclua usuários
    function handleExcluir(usuarioId: string) {
        if (window.confirm("Tem certeza que deseja excluir este usuário? (Esta ação não pode ser desfeita)")) {
            api.delete(`/admin/users/${usuarioId}`)
                .then(() => {
                    alert("Usuário excluído com sucesso!");
                    fetchUsuarios(); // Atualiza a lista
                })
                .catch(err => alert(`Erro ao excluir usuário. ${err}`));
        }
    }

    return (
            <div className="space-y-6">
                {/* Cabeçalho da Seção */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-[#344733]">Gerenciar Usuários</h3>
                        <p className="text-sm text-[#8A9B6F] mt-1">
                            Visualize e gerencie os usuários cadastrados no sistema
                        </p>
                    </div>
                </div>

                {/* Card da Tabela */}
                <div className="bg-white rounded-lg shadow-sm border border-[#B99375]/10 p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#B99375]/10">
                                    <th className="text-left py-3 px-4 text-[#344733] font-semibold">Nome</th>
                                    <th className="text-left py-3 px-4 text-[#344733] font-semibold">Email</th>
                                    <th className="text-center py-3 px-4 text-[#344733] font-semibold">Idade</th>
                                    <th className="text-left py-3 px-4 text-[#344733] font-semibold">Tipo</th>
                                    <th className="text-right py-3 px-4 text-[#344733] font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user => (
                                    <tr key={user._id} className="border-b border-[#B99375]/10 hover:bg-[#F3F4FD]/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="font-medium text-[#344733]">{user.nome}</span>
                                        </td>
                                        <td className="py-3 px-4 text-[#8A9B6F]">{user.email}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#8A9B6F]/10 rounded-full text-[#344733]">
                                                {user.idade}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' 
                                                ? 'bg-[#B99375]/20 text-[#B99375]' 
                                                : 'bg-[#8A9B6F]/20 text-[#8A9B6F]'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleExcluir(user._id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                                            >
                                                Excluir Usuário
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
}

export default GerenciarUsuarios;