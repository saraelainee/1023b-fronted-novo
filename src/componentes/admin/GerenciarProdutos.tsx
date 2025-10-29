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
        <div>
            <h3>{produtoEditando ? 'Editando Produto' : 'Cadastrar Novo Produto'}</h3>
            
            {/* TAREFA LAÍSA: Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} style={formStyle}>
                <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
                <input name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Categoria" required />
                <input name="preco" value={formData.preco} onChange={handleChange} placeholder="Preço" type="number" step="0.01" required />
                <input name="urlfoto" value={formData.urlfoto} onChange={handleChange} placeholder="URL da Foto" required />
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" required />
                <button type="submit">{produtoEditando ? 'Salvar Alterações' : 'Cadastrar'}</button>
                {/* Botão para cancelar edição */}
                {produtoEditando && <button type="button" onClick={resetForm}>Cancelar Edição</button>}
            </form>
            
            <hr style={{ margin: '20px 0' }} />

            <h3>Lista de Produtos Cadastrados</h3>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map(p => (
                        <tr key={p._id}>
                            <td>{p.nome}</td>
                            <td>{p.categoria}</td>
                            <td>R$ {p.preco.toFixed(2)}</td>
                            <td>
                                {/* TAREFA LAÍSA: Botão Editar */}
                                <button onClick={() => handleEditar(p)}>Editar</button>
                                
                                {/* TAREFA VÂNIA: Botão Excluir */}
                                <button onClick={() => handleExcluir(p._id)} style={{ marginLeft: '5px' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Estilos simples para o formulário
const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '500px'
};

export default GerenciarProdutos;