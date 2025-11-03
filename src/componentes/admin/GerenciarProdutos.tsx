import { useState, useEffect, type FormEvent } from 'react';
import api from '../../api/api';

type ProdutoType = {
  _id: string,
  nome: string, 
  preco: number, 
  urlfoto: string, 
  descricao: string, 
  categoria: string;
}

// O tipo para o formulário (sem o _id)
type ProdutoFormType = Omit<ProdutoType, '_id'>;

function GerenciarProdutos() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([]);
    
    // TAREFA LAÍSA: Estado para controlar qual produto está sendo editado
    const [produtoEditando, setProdutoEditando] = useState<ProdutoType | null>(null);
    
    // TAREFA LAÍSA: Estado para os dados do formulário (novo ou edição)
    const [formData, setFormData] = useState<ProdutoFormType>({
        nome: '',
        preco: 0,
        urlfoto: '',
        descricao: '',
        categoria: ''
    });

    // Função para buscar os produtos
    function fetchProdutos() {
        api.get('/produtos') // Busca pública
            .then(res => setProdutos(res.data))
            .catch(err => alert(`Erro ao buscar produtos. ${err}`));
    }

    // Busca produtos ao carregar o componente
    useEffect(() => {
        fetchProdutos();
    }, []);

    // Atualiza o estado do formulário
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'preco' ? parseFloat(value) : value // Converte preço para número
        }));
    }

    // TAREFA LAÍSA: Limpa o formulário e 'produtoEditando'
    function resetForm() {
        setFormData({ nome: '', preco: 0, urlfoto: '', descricao: '', categoria: '' });
        setProdutoEditando(null);
    }

    // TAREFA LAÍSA: Envio do Formulário (Cadastrar ou Editar)
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (produtoEditando) {
            // --- MODO EDIÇÃO ---
            // TAREFA LAÍSA (Editar)
            api.put(`/admin/produtos/${produtoEditando._id}`, formData)
                .then(() => {
                    alert("Produto atualizado com sucesso!");
                    resetForm();
                    fetchProdutos(); // Atualiza a lista
                })
                .catch(err => alert("Erro ao atualizar produto: " + (err.response?.data?.error || "Erro")));
        } else {
            // --- MODO CADASTRO ---
            // TAREFA LAÍSA (Cadastrar)
            api.post('/admin/produtos', formData)
                .then(response => {
                    alert("Produto cadastrado com sucesso!");
                    resetForm();
                    // Adiciona o novo produto na lista local (ou faz fetchProdutos())
                    setProdutos(prev => [...prev, response.data]);
                })
                .catch(err => alert("Erro ao cadastrar produto: " + (err.response?.data?.error || "Erro")));
        }
    }

    // TAREFA LAÍSA: Preenche o formulário para edição
    function handleEditar(produto: ProdutoType) {
        setProdutoEditando(produto); // Define o produto que estamos editando
        setFormData(produto);      // Preenche o formulário com seus dados
    }

    // TAREFA VÂNIA: Excluir um produto
    function handleExcluir(produtoId: string) {
        // TAREFA VÂNIA: Adiciona a confirmação
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            api.delete(`/admin/produtos/${produtoId}`)
                .then(() => {
                    alert("Produto excluído com sucesso!");
                    fetchProdutos(); // Atualiza a lista
                })
                .catch(err => alert(`Erro ao excluir produto. ${err}`));
        }
    }

    return (
        <div className="space-y-8">
            {/* Seção do Formulário */}
            <div className="bg-white rounded-lg shadow-sm border border-[#B99375]/10 p-6">
                <h3 className="text-xl font-semibold text-[#344733] mb-4">
                    {produtoEditando ? 'Editando Produto' : 'Cadastrar Novo Produto'}
                </h3>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Nome do Produto"
                        required
                        className="px-4 py-2 border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F] focus:border-transparent"
                    />
                    <input
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Categoria"
                        required
                        className="px-4 py-2 border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F] focus:border-transparent"
                    />
                    <input
                        name="preco"
                        value={formData.preco}
                        onChange={handleChange}
                        placeholder="Preço"
                        type="number"
                        step="0.01"
                        required
                        className="px-4 py-2 border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F] focus:border-transparent"
                    />
                    <input
                        name="urlfoto"
                        value={formData.urlfoto}
                        onChange={handleChange}
                        placeholder="URL da Foto"
                        required
                        className="px-4 py-2 border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F] focus:border-transparent"
                    />
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        placeholder="Descrição do Produto"
                        required
                        className="md:col-span-2 px-4 py-2 border border-[#B99375]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A9B6F] focus:border-transparent h-24 resize-none"
                    />
                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#8A9B6F] to-[#B99375] text-white py-2 px-4 rounded-md hover:opacity-90 transition-all duration-200"
                        >
                            {produtoEditando ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>
                        {produtoEditando && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-[#B99375] text-[#344733] rounded-md hover:bg-[#F3F4FD] transition-colors"
                            >
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Seção da Tabela */}
            <div className="bg-white rounded-lg shadow-sm border border-[#B99375]/10 p-6">
                <h3 className="text-xl font-semibold text-[#344733] mb-4">
                    Lista de Produtos Cadastrados
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#B99375]/10">
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Nome</th>
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Categoria</th>
                                <th className="text-left py-3 px-4 text-[#344733] font-semibold">Preço</th>
                                <th className="text-right py-3 px-4 text-[#344733] font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(p => (
                                <tr key={p._id} className="border-b border-[#B99375]/10 hover:bg-[#F3F4FD]/50 transition-colors">
                                    <td className="py-3 px-4">{p.nome}</td>
                                    <td className="py-3 px-4">{p.categoria}</td>
                                    <td className="py-3 px-4">R$ {p.preco.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEditar(p)}
                                            className="inline-flex items-center px-3 py-1.5 bg-[#8A9B6F] text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleExcluir(p._id)}
                                            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                                        >
                                            Excluir
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

export default GerenciarProdutos;