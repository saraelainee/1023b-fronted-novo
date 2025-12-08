import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

type ItemType = {
    produtoId: string;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    precoAntigo?: number; // Novo
    indisponivel?: boolean; // Novo
}
type CarrinhoType = {
    _id: string;
    usuarioId: string;
    itens: ItemType[];
    total: number;
}

function Carrinho() {
    const navigate = useNavigate();

    // Correção do useState
    const [carrinho, setCarrinho] = useState<CarrinhoType | null>(null);

    // Função para buscar os dados do carrinho na API
    function fetchCarrinho() {
        api.get('/carrinho')
            .then(response => {
                setCarrinho(response.data.data);
            })
            .catch(error => {
                console.error("Erro ao buscar carrinho:", error);
                alert("Erro ao carregar seu carrinho. Tente recarregar a página.");
            });
    }

    // Busca o carrinho assim que a página carrega
    useEffect(() => {
        fetchCarrinho();
    }, []); // [] = Executa só uma vez


    // TAREFA LORENA
    function handleAlterarQuantidade(produtoId: string, novaQuantidade: number) {
        api.put('/carrinho/atualizarItem', {
            produtoId: produtoId,
            quantidade: novaQuantidade
        })
            .then(() => {
                fetchCarrinho();
            })
            .catch(error => {
                console.error("Erro ao alterar quantidade:", error);
                alert("Erro ao alterar quantidade.");
            });
    }

    // TAREFA SARA (sem mudanças)
    function handleRemoverItem(produtoId: string) {
        api.post('/carrinho/removerItem', { produtoId: produtoId })
            .then(() => {
                alert("Item removido!");
                fetchCarrinho();
            })
            .catch(error => {
                console.error("Erro ao remover item:", error);
                alert("Erro ao remover item.");
            });
    }

    // TAREFA LAÍSA: Excluir o carrinho inteiro
    function handleExcluirCarrinho() {
        api.delete('/carrinhoDeleta')
            .then(() => {
                alert("Carrinho excluído com sucesso!");
                // <-- MUDANÇA: Usamos setCarrinho para limpar o estado local
                setCarrinho(null);
                navigate("/"); // Volta para a home
            })
            .catch(error => {
                console.error("Erro ao excluir carrinho:", error);
                alert("Erro ao excluir carrinho.");
            });
    }

    // Se o carrinho ainda não carregou
    if (!carrinho) {
        return (
            <div className="min-h-screen flex flex-col items-center p-6 mt-20">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="animate-pulse text-[#344733]">Carregando seu carrinho...</div>
                    </div>
                </div>
            </div>
        );
    }

    const itens = carrinho.itens ?? [];
    const total = carrinho.total ?? 0;

    const temItemIndisponivel = itens.some(item => item.indisponivel);

    // Se o carrinho estiver vazio
    if (itens.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center p-6 mt-20">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h1 className="text-xl text-[#344733]">Seu carrinho está vazio</h1>
                        <p className="text-[#8A9B6F] mt-2">Que tal adicionar alguns produtos?</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-6 mt-20">
            <div className="w-full max-w-6xl space-y-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#344733]">Carrinho de Compras</h1>
                        <p className="text-sm text-[#8A9B6F] mt-1">
                            {itens.length} {itens.length === 1 ? 'item' : 'itens'} no seu carrinho
                        </p>
                    </div>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-[#B99375]/10">
                                    <th className="text-left py-3 px-4 text-[#344733] font-semibold">Produto</th>
                                    <th className="text-right py-3 px-4 text-[#344733] font-semibold">Preço Unit.</th>
                                    <th className="text-center py-3 px-4 text-[#344733] font-semibold">Quantidade</th>
                                    <th className="text-right py-3 px-4 text-[#344733] font-semibold">Subtotal</th>
                                    <th className="text-right py-3 px-4 text-[#344733] font-semibold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itens.map(item => (
                                    <tr key={item.produtoId} className={`border-b border-[#B99375]/10 transition-colors ${item.indisponivel ? 'bg-red-50' : 'hover:bg-[#F3F4FD]/50'}`}>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${item.indisponivel ? 'text-red-500 line-through' : 'text-[#344733]'}`}>
                                                    {item.nome}
                                                </span>
                                                {/* AVISO DE INDISPONÍVEL */}
                                                {item.indisponivel && (
                                                    <span className="text-xs text-red-600 font-bold mt-1">
                                                        PRODUTO INDISPONÍVEL (Remova para continuar)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex flex-col items-end">
                                                {/* LÓGICA DE PREÇO ATUALIZADO */}
                                                {(!item.indisponivel && item.precoAntigo && item.precoAntigo !== item.precoUnitario) && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        R$ {item.precoAntigo.toFixed(2)}
                                                    </span>
                                                )}
                                                <span className={`text-[#8A9B6F] ${item.indisponivel ? 'opacity-50' : ''}`}>
                                                    R$ {item.precoUnitario.toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {item.indisponivel ? (
                                                <div className="text-center text-gray-400">-</div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.quantidade}
                                                        onChange={(e) => handleAlterarQuantidade(item.produtoId, parseInt(e.target.value))}
                                                        className="w-16 px-2 py-1 text-center border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F]"
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right font-medium text-[#344733]">
                                            {item.indisponivel ? '---' : `R$ ${(item.precoUnitario * item.quantidade).toFixed(2)}`}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => handleRemoverItem(item.produtoId)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Rodapé do Card com Total e Ações */}
                    <div className="mt-6 pt-6 border-t border-[#B99375]/10">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <button
                                    onClick={handleExcluirCarrinho}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:opacity-90 transition-opacity"
                                >
                                    Excluir Carrinho
                                </button>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    disabled={temItemIndisponivel} // BLOQUEIA SE TIVER ITEM RUIM
                                    className={`ml-4 px-6 py-2 text-white rounded-md font-bold transition-colors ${temItemIndisponivel
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-[#8A9B6F] hover:bg-[#344733]'
                                        }`}
                                    title={temItemIndisponivel ? "Remova os itens indisponíveis para continuar" : ""}
                                >
                                    Finalizar Compra
                                </button>
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-[#8A9B6F]">Total do Carrinho</span>
                                <div className="text-2xl font-bold text-[#344733]">
                                    R$ {total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Carrinho;