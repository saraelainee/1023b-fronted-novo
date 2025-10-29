// ARQUIVO: src/componentes/carrinho/carrinho.tsx (MODIFICADO)
import { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

// Define os tipos que esperamos receber do backend
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
    total: number; // TAREFA VÂNIA
}

function Carrinho() {
    const navigate = useNavigate();
    // Estado para guardar o carrinho
    const [carrinho, setCarrinho] = useState<CarrinhoType | null>(null);

    // Função para buscar os dados do carrinho na API
    function fetchCarrinho() {
        api.get('/carrinho')
            .then(response => {
                // O backend (controller) retorna { success: true, data: ... }
                setCarrinho(response.data.data); 
            })
            .catch(error => {
                console.error("Erro ao buscar carrinho:", error);
                // TAREFA SARA: Mensagem amigável
                alert("Erro ao carregar seu carrinho. Tente recarregar a página.");
            });
    }

    // Busca o carrinho assim que a página carrega
    useEffect(() => {
        fetchCarrinho();
    }, []); // [] = Executa só uma vez

    
    // TAREFA LORENA: Alterar a quantidade de um item
    function handleAlterarQuantidade(produtoId: string, novaQuantidade: number) {
        // Validação simples
        if (novaQuantidade < 0) {
            alert("Quantidade não pode ser negativa.");
            return;
        }

        // Se a quantidade for 0, usa a função de remover
        if (novaQuantidade === 0) {
            handleRemoverItem(produtoId);
            return;
        }

        api.put('/carrinho/atualizarItem', { 
            produtoId: produtoId, 
            quantidade: novaQuantidade 
        })
        .then(() => {
            alert("Quantidade atualizada!");
            fetchCarrinho(); // Atualiza a tela com os novos dados
        })
        .catch(error => {
            console.error("Erro ao alterar quantidade:", error);
            alert("Erro ao alterar quantidade.");
        });
    }

    // TAREFA SARA: Remover um item do carrinho
    function handleRemoverItem(produtoId: string) {
        if (!window.confirm("Tem certeza que deseja remover este item?")) {
            return;
        }

        api.post('/carrinho/removerItem', { produtoId: produtoId })
        .then(() => {
            alert("Item removido!");
            fetchCarrinho(); // Atualiza a tela
        })
        .catch(error => {
            console.error("Erro ao remover item:", error);
            alert("Erro ao remover item.");
        });
    }

    // TAREFA LAÍSA: Excluir o carrinho inteiro
    function handleExcluirCarrinho() {
        if (!window.confirm("ATENÇÃO! Isso apagará todo o seu carrinho. Deseja continuar?")) {
            return;
        }
        
        // Rota (DELETE /carrinho) que apaga o carrinho do usuário logado
        api.delete('/carrinho')
        .then(() => {
            alert("Carrinho excluído com sucesso!");
            setCarrinho(null); // Limpa o estado local
            navigate("/"); // Volta para a home
        })
        .catch(error => {
            console.error("Erro ao excluir carrinho:", error);
            alert("Erro ao excluir carrinho.");
        });
    }

    // Se o carrinho ainda não carregou
    if (!carrinho) {
        return <h1>Carregando seu carrinho...</h1>
    }
    
    // Se o carrinho estiver vazio
    if (carrinho.itens.length === 0) {
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
                    {carrinho.itens.map(item => (
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
            <h2>Total do Carrinho: R$ {carrinho.total.toFixed(2)}</h2>

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