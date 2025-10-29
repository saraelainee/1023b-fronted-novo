import { useState, useEffect } from 'react';
import api from '../../api/api';

type CarrinhoAdminType = {
    _id: string; // ID do Carrinho
    total: number;
    dataAtualizacao: string;
    quantidadeItens: number;
    usuario: { // Informações do dono (TAREFA SARA)
        _id: string;
        nome: string;
        email: string;
    }
}

function GerenciarCarrinhos() {
    const [carrinhos, setCarrinhos] = useState<CarrinhoAdminType[]>([]);

    // Função para buscar os carrinhos
    function fetchCarrinhos() {
        // TAREFA SARA: Listar todos os carrinhos e o nome do dono
        api.get('/admin/carrinhos')
            .then(res => {
                setCarrinhos(res.data.data); // O backend retorna { success: true, data: [...] }
            })
            .catch(err => alert(`Erro ao buscar carrinhos. ${err}`));
    }

    // Busca os carrinhos ao carregar
    useEffect(() => {
        fetchCarrinhos();
    }, []);

    // TAREFA SARA: Permitir que o ADMIN exclua carrinhos
    function handleExcluir(carrinhoId: string) {
        if (window.confirm("Tem certeza que deseja excluir este carrinho?")) {
            // Usa a rota de admin para deletar por ID do *carrinho*
            api.delete(`/admin/carrinhos/${carrinhoId}`) 
                .then(() => {
                    alert("Carrinho excluído com sucesso!");
                    fetchCarrinhos(); // Atualiza a lista
                })
                .catch(err => alert(`Erro ao excluir carrinho. ${err}`));
        }
    }

    return (
        <div>
            <h3>Gerenciar Carrinhos de Usuários</h3>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Dono do Carrinho</th>
                        <th>Email do Dono</th>
                        <th>Qtd. Itens</th>
                        <th>Total</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                {/* TAREFA SARA: Lista os carrinhos */}
                <tbody>
                    {carrinhos.map(cart => (
                        <tr key={cart._id}>
                            {/* Verifica se o usuário ainda existe */}
                            <td>{cart.usuario ? cart.usuario.nome : '[Usuário Deletado]'}</td>
                            <td>{cart.usuario ? cart.usuario.email : 'N/A'}</td>
                            <td>{cart.quantidadeItens}</td>
                            <td>R$ {cart.total.toFixed(2)}</td>
                            <td>{new Date(cart.dataAtualizacao).toLocaleString('pt-BR')}</td>
                            <td>
                                {/* TAREFA SARA: Botão Excluir */}
                                <button onClick={() => handleExcluir(cart._id)}>Excluir Carrinho</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GerenciarCarrinhos;