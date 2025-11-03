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
        <div className="space-y-6">
            {/* Cabeçalho da Seção */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-[#344733]">Gerenciar Carrinhos de Usuários</h3>
                    <p className="text-sm text-[#8A9B6F] mt-1">
                        Visualize e gerencie os carrinhos ativos no sistema
                    </p>
                </div>
            </div>

            {/* Card da Tabela */}
            <div className="bg-white rounded-lg shadow-sm border border-[#B99375]/10 p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#B99375]/10">
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Dono do Carrinho</th>
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Email do Dono</th>
                                <th className="text-center py-3 px-4 text-[#344733] font-semibold">Qtd. Itens</th>
                                <th className="text-right py-3 px-4 text-[#344733] font-semibold">Total</th>
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Última Atualização</th>
                                <th className="text-right py-3 px-4 text-[#344733] font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrinhos.map(cart => (
                                <tr key={cart._id} className="border-b border-[#B99375]/10 hover:bg-[#F3F4FD]/50 transition-colors">
                                    <td className="py-3 px-4">
                                        {cart.usuario ? (
                                            <span className="font-medium text-[#344733]">{cart.usuario.nome}</span>
                                        ) : (
                                            <span className="text-red-500 text-sm">[Usuário Deletado]</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-[#8A9B6F]">
                                        {cart.usuario ? cart.usuario.email : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#8A9B6F]/10 rounded-full text-[#344733]">
                                            {cart.quantidadeItens}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium text-[#344733]">
                                        R$ {cart.total.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-[#8A9B6F]">
                                        {new Date(cart.dataAtualizacao).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleExcluir(cart._id)}
                                            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                                        >
                                            Excluir Carrinho
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

export default GerenciarCarrinhos;