// ARQUIVO: src/componentes/produtos/Produtos.tsx (NOVO)
import { useState, useEffect } from 'react';
import api from '../../api/api';
// (Importe o seu CSS se desejar, ex: './Produtos.css')

// Define o tipo do Produto (IMPORTANTE: Adicionamos 'categoria')
type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string,
  categoria: string; // Campo novo que o backend agora suporta
}

// Define o tipo para o item do carrinho
type ItemCarrinhoType = {
    produtoId: string;
    quantidade: number;
}

function Produtos() {
    // Estado para guardar TODOS os produtos vindos da API
    const [produtos, setProdutos] = useState<ProdutoType[]>([]);
    
    // TAREFA LAÍSA: Estado para o texto de busca
    const [busca, setBusca] = useState("");

    // TAREFA LORENA: Consumir a rota /produtos com axios
    useEffect(() => {
        // Rota pública, não precisa de token
        api.get("/produtos")
            .then((response) => {
                setProdutos(response.data);
            })
            .catch((error) => {
                // TAREFA SARA: Mensagem amigável
                console.error('Erro ao buscar produtos:', error);
                alert("Erro ao buscar produtos. Tente novamente.");
            });
    }, []); // O [] significa que executa só uma vez (quando o componente carrega)


    // TAREFA LAÍSA: Lógica do filtro
    // Filtra a lista de 'produtos' com base na 'busca'
    // Compara em minúsculas para não diferenciar
    const produtosFiltrados = produtos.filter((produto) => 
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(busca.toLowerCase())
    );


    // Função para adicionar ao carrinho (Usuário Logado)
    function adicionarAoCarrinho(produtoId: string) {
        const item: ItemCarrinhoType = {
            produtoId: produtoId,
            quantidade: 1
        };

        api.post('/carrinho/adicionarItem', item)
            .then(() => {
                alert("Produto adicionado ao carrinho!");
            })
            .catch((error) => {
                console.error('Erro ao adicionar item:', error);
                // TAREFA SARA: Mensagem amigável
                // (O 'api.ts' já redireciona se for 401 (sem login))
                alert("Erro ao adicionar produto: " + (error?.response?.data?.mensagem || "Tente novamente."));
            });
    }

    return (
        <div>
            <h1>Catálogo de Produtos</h1>

            {/* TAREFA LAÍSA: Campo de busca */}
            <form className="busca-form">
                <input 
                    type="text"
                    placeholder="Buscar por nome ou categoria..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)} // Atualiza o estado 'busca'
                    style={{ width: '300px', padding: '8px' }}
                />
            </form>

            <hr />

            {/* TAREFA LORENA: Listagem dos produtos (agora filtrados) */}
            <div className="lista-produtos" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {produtosFiltrados.map((produto) => (
                    <div key={produto._id} className="card-produto" style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
                        <h2>{produto.nome}</h2>
                        <img src={produto.urlfoto} alt={produto.nome} width="200" />
                        <p>R$ {produto.preco.toFixed(2)}</p>
                        <p>Categoria: {produto.categoria}</p>
                        <p>{produto.descricao}</p>
                        
                        {/* Botão de adicionar (função movida do App.tsx) */}
                        <button onClick={() => adicionarAoCarrinho(produto._id)}>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Produtos;