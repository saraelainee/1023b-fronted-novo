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
        <div>
            <h3>Gerenciar Usuários</h3>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Idade</th>
                        <th>Tipo (Role)</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                {/* TAREFA LORENA: Lista os usuários */}
                <tbody>
                    {usuarios.map(user => (
                        <tr key={user._id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.idade}</td>
                            <td>{user.role}</td>
                            <td>
                                {/* TAREFA SARA: Botão Excluir */}
                                <button onClick={() => handleExcluir(user._id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GerenciarUsuarios;