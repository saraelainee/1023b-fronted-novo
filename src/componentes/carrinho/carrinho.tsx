import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

type ItemType = {
    produtoId: string;
    nome: string;
    quantidade: number;
    precoUnitario: number;
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
                alert("Quantidade atualizada!");
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
        console.log(carrinho)
        return <h1>Carregando seu carrinho...</h1>
    }

    const itens = carrinho.itens ?? [];
    const total = carrinho.total ?? 0;

    // Se o carrinho estiver vazio
    if (itens.length === 0) {
        return <h1>Seu carrinho está vazio.</h1>
    }

    return (
        <>
            <h1>Carrinho de Compras</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço Unit.</th>
                        <th>Quantidade</th>
                        <th>Subtotal</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map(item => (
                        <tr key={item.produtoId}>
                            <td>{item.nome}</td>
                            <td>R$ {item.precoUnitario.toFixed(2)}</td>
                            <td>
                                {/* TAREFA LORENA: Input para alterar quantidade */}
                                <input
                                    type="number"
                                    min="0"
                                    value={item.quantidade}
                                    onChange={(e) => handleAlterarQuantidade(item.produtoId, parseInt(e.target.value))}
                                    style={{ width: '60px' }}
                                />
                            </td>
                            <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                            <td>
                                {/* TAREFA SARA: Botão para remover item */}
                                <button onClick={() => handleRemoverItem(item.produtoId)}>
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* TAREFA VÂNIA: Exibir o total atualizado do carrinho */}
            <h2>Total do Carrinho: R$ {total.toFixed(2)}</h2>

            <hr />

            {/* TAREFA LAÍSA: Botão para excluir o carrinho inteiro */}
            <button
                onClick={handleExcluirCarrinho}
                style={{ backgroundColor: '#f44336', color: 'white', padding: '10px' }}
            >
                Excluir Carrinho Inteiro
            </button>
        </>
    )
}
export default Carrinho;