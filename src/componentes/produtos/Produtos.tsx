// ARQUIVO: src/componentes/produtos/Produtos.tsx (CORRIGIDO)
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

// Define o tipo do Produto
type ProdutoType = {
    _id: string,
    nome: string,
    preco: number,
    urlfoto: string,
    descricao: string,
    categoria: string;
}

// Define o tipo para o item do carrinho
type ItemCarrinhoType = {
    produtoId: string;
    quantidade: number;
}

function Produtos() {
    
    const navigate = useNavigate();
    // Estado para guardar TODOS os produtos vindos da API
    const [produtos, setProdutos] = useState<ProdutoType[]>([]);

    // Estado para o texto de busca
    const [busca, setBusca] = useState("");

    // Consumir a rota /produtos com axios
    useEffect(() => {
        api.get("/produtos")
            .then((response) => {
                const data: any = response.data;
                const lista = Array.isArray(data)
                    ? data
                    : (Array.isArray(data?.produtos) ? data.produtos : []);
                setProdutos(lista);
            })
            .catch((error) => {
                console.error('Erro ao buscar produtos:', error);
                alert("Erro ao buscar produtos. Tente novamente.");
            });
    }, []);

    // Filtra a lista de 'produtos' com base na 'busca'
    const produtosFiltrados = produtos.filter((produto) => {
        const buscaLower = busca?.toLowerCase() || '';
        const nomeProduto = produto.nome?.toLowerCase() || '';
        const categoriaProduto = produto.categoria?.toLowerCase() || '';
        return nomeProduto.includes(buscaLower) || categoriaProduto.includes(buscaLower);
    });

    // --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
    function adicionarAoCarrinho(produtoId: string) {
        
        // 1. Verifica se o usuário tem o token salvo (está logado?)
        const token = localStorage.getItem('token'); 

        // 2. Se NÃO tiver token, avisa e manda para o Login, SEM chamar a API
        if (!token) {
            alert("Você precisa estar logado para adicionar produtos ao carrinho!");
            navigate('/login'); // Redireciona para a tela de login
            return; // Para a execução aqui
        }

        // 3. Se tiver token, executa a lógica normal
        const item: ItemCarrinhoType = { produtoId: produtoId, quantidade: 1 };
        
        api.post('/carrinho/adicionarItem', item)
            .then(() => alert("Produto adicionado ao carrinho!"))
            .catch((error) => {
                console.error('Erro ao adicionar item:', error);
                
                // Tratamento caso o token tenha expirado (Erro 401)
                if (error.response && error.response.status === 401) {
                    alert("Sua sessão expirou. Por favor, faça login novamente.");
                    localStorage.removeItem('token'); // Limpa o token inválido
                    navigate('/login');
                } else {
                    alert("Erro ao adicionar produto: " + (error?.response?.data?.mensagem || "Tente novamente."));
                }
            });
    }

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault();

    return (
        <div className="min-h-screen flex flex-col items-center bg-transparent p-6 mt-20">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-[#344733]">Catálogo de Produtos</h1>

                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou categoria..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="px-3 py-2 border border-[#B99375] rounded-md focus:outline-none"
                            style={{ width: 300 }}
                        />
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produtosFiltrados.map((produto) => (
                        <div key={produto._id} className="bg-white rounded-lg shadow-md overflow-hidden border" style={{ borderColor: '#B99375' }}>
                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                                <img src={produto.urlfoto} alt={produto.nome} className="max-h-44 object-contain" />
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-[#344733]">{produto.nome}</h2>
                                <p className="text-sm text-[#8A9B6F] font-medium">Categoria: {produto.categoria}</p>
                                <p className="mt-2 text-[#344733]">{produto.descricao}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xl font-bold text-[#344733]">R$ {produto.preco.toFixed(2)}</span>
                                    <button
                                        onClick={() => adicionarAoCarrinho(produto._id)}
                                        className="bg-[#8A9B6F] text-white px-3 py-2 rounded-md hover:opacity-90 cursor-pointer"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Produtos;